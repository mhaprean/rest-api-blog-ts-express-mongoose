import app from './app';
import mongoose from 'mongoose';

const start = async () => {
  if (!process.env.MONGO_DB_URL) {
    console.log('MONGO_URL is not defined in the env file');
    process.exit(1);
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
