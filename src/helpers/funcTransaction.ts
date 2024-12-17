import mongoose, { ClientSession } from 'mongoose';

const funcTransaction = async <T>(operation: (session: ClientSession) => Promise<T>): Promise<T> => {
   const session = await mongoose.startSession();

   session.startTransaction();

   try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      await session.endSession();
   }
};

export default funcTransaction;
