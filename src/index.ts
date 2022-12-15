import app from './app';
import mongoose from 'mongoose';
import fs from 'fs';

const start = async () => {
  if (!process.env.MONGO_DB_URL) {
    console.log('MONGO_URL is not defined in the env file');
    process.exit(1);
  }

  const dir = __dirname + '/uploads';

  // if the uploads folder does not exists, we need to create it
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, 0o777, (err) => {
      console.log('could not create the folder: ', err);
    });
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(process.env.PORT || 3000, () => console.log('App started'));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
