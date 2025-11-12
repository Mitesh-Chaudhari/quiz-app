import app from './app.js';
import connectDB from './src/db/dbConnect.js';

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(port, ()=> {
        console.log(`Server is running on port ${port}`);
    })
}).catch((error) => console.log("Error connecting to the database:", error));

