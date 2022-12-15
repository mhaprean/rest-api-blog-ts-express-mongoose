import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

import dotenv from 'dotenv';

dotenv.config();

// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//   region: process.env.AWS_REGION || '',
// });

const s3Config = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const multerUpload = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME || '',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '_' + file.originalname);
    },
  }),
});
