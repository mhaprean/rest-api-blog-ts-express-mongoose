import express, { Request } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';
import fileUpload, { UploadedFile } from 'express-fileupload';
import categoryRoutes from './routes/categoryRoutes';
import tagRoutes from './routes/tagRoutes';
import { Deta } from 'deta';
import { isAuth } from './middleware/authMiddleware';

const app = express();
dotenv.config();

// app middlewares
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(fileUpload());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

app.get('/', (req, res) => {
  return res.send('welcome to blog rest api.');
});

const deta = Deta(process.env.DETA_PROJECT_KEY);

const drive = deta.Drive('images');

const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

app.post('/api/upload', isAuth, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json('No files were uploaded.');
  } // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image as UploadedFile;

  const whitelistMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  if (!whitelistMimeTypes.includes(sampleFile.mimetype)) {
    return res.status(400).json('Extension not allowed. try png, jpg, jpeg or webp');
  }

  const extension = sampleFile.mimetype.replace('image/', '');

  const name = Date.now() + '_'  + slugify(sampleFile.name).slice(0,4) + '.' + extension;
  const contents = sampleFile.data;

  const img = await drive.put(name, { data: contents });
  res.json('images/' + img);
});

app.get('/api/images/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const image = await drive.get(name);

    if (image) {
      const buffer = await image.arrayBuffer();
      res.contentType('image/png').send(Buffer.from(buffer));
    } else {
      res.status(400).json('image doesnt exist');
    }
  } catch (error) {
    return res.status(400).json('something went wrong');
  }
});

export default app;
