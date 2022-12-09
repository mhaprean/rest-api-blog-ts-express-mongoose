import app from './app';
import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_DB_URL) {
    console.log('MONGO_URL is not defined in the env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('MongoDB connected');
  } catch (err) {
    console.log('err: ', err);
    process.exit(1);
  }
};

app.listen(process.env.PORT || 3000, async () => {
  console.log('application started');
  await connectDB();
});
