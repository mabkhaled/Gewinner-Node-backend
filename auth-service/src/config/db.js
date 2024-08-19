const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            // Remove deprecated options
            // useNewUrlParser: true, // No longer needed
            // useUnifiedTopology: true, // No longer needed
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Remove useFindAndModify option
            // useFindAndModify: false, // No longer valid
            // Add any other options you may need
        });

        // Optional: Mongoose no longer uses useFindAndModify by default
        // You can set it to false if needed
        // mongoose.set('useFindAndModify', false);

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
