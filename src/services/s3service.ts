import AWS, { S3 } from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const s3Uploadv3 = async (files: any[], title: string) => {
  const s3client = new S3Client({});

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: title,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3client.send(new PutObjectCommand(param))));
};

export const s3GetFile = async (fileName: string) => {
  const s3 = new AWS.S3();

  let file = await s3
    .getObject({
      Bucket: process.env.AWS_BUCKET_NAME || '',
      Key: fileName,
    })
    .promise();


    console.log('s3 get file ', file);

    return file;
};
