import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const con = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, {
        });
        console.log(`MongoDB Connected: ${con.connection.host}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;