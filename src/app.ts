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
import path from 'path';
import fs from 'fs';

import multer from 'multer';
import { s3GetFile, s3Uploadv3 } from './services/s3service';

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(fileUpload());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);

app.get('/', (req, res) => {
  return res.send('welcome to blog rest api.');
});

// the image field must have the name "image"
// this works fine on localhost but not on cyclic
app.post('/api/upload', function async(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  } // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image as UploadedFile;

  const dir = __dirname + '/uploads';

  // if the uploads folder does not exists, we need to create it
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, 0o777, (err) => {
      console.log('could not create the folder: ', err);
      res.status(500).send({ msg: 'could not create the folder', err });
    });
  }

  const fileName = '/uploads/' + Date.now() + '_' + sampleFile.name;
  const uploadPath = __dirname + fileName; // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send({ ok: 'File uploaded!', file: fileName });
  });
});




// test aws upload using cyclic
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: Function) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

app.post('/api/s3upload', upload.array('file'), async (req, res) => {
  try {

    let fName = '';

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      fName = (req.files[0] as any).originalname;
    }
    
    const title =  `uploads/${Date.now()}-${fName}`
    const results = await s3Uploadv3(req.files as any, title);
    console.log(results);

    let file = await s3GetFile(title);

    return res.json({ status: 'success', results, file });
  } catch (err) {
    res.status(400).send({ msg: 'could not upload file', err });
  }
});

export default app;
