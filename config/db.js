const mongoose = require('mongoose');

// connect to mongo db
const connectDB = async () => {
	try {
		const Myconnection = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log(`mongoDB connected on ${Myconnection.connection.host}`);
	} catch (error) {
		console.error(`error with connection`, error);
		process.exit(1);
	}
};

module.exports = connectDB;
