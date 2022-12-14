import express from 'express';
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
import fs from 'fs';
import categoryRoutes from './routes/categoryRoutes';

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

app.use(fileUpload());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  return res.send('welcome to blog rest api.');
});

app.post('/api/upload', function async(req, res) {
  console.log('!! req.files', req.files);

  const dir = __dirname + '/uploads';

  fs.mkdir(dir, 0o777, (err) => {
    console.log('we have an error: ', err);
  });
  

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  } // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file as UploadedFile;
  const uploadPath = __dirname + '/uploads/' + sampleFile.name; // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send({ ok: 'File uploaded!', file: sampleFile.name });
  });
});

export default app;
