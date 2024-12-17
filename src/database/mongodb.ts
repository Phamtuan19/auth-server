/* eslint-disable no-console */
/**
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL =
   'mongodb+srv://phamtuan19hd:KbYAYeIYKrVUlgkb@cecudity.liyx1.mongodb.net/?retryWrites=true&w=majority&appName=cecudity';

const connectMongoDB = async () => {
   mongoose.set('strictQuery', false);

   try {
      await mongoose.connect(DB_URL, {
         dbName: 'AuthDB',
      } as ConnectOptions);
   } catch (error) {
      console.error('🚀 ~ Mongoose default connection has occurred ', error);
   }

   mongoose.connection.on('disconnected', function () {
      console.log('🚀 ~ Mongoose default connection is disconnected');
   });
};

export default connectMongoDB;
