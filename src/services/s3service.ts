import { S3 } from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


export const s3Uploadv3 = async (files: any[]) => {
  const s3client = new S3Client({});

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
};
