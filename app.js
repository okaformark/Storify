const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const expressHandleBars = require('express-handlebars');
const routes = require('./routes/index');
const auth = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const { Mongoose } = require('mongoose');

//load dotenv file
dotenv.config({ path: './config/config.env' });

// load passport
require('./config/passport')(passport);

//connect your DB
connectDB();

// initialize express
const app = express();

//Use morgan for logging any client request error
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Intialize handlebars
app.engine(
	'.hbs',
	expressHandleBars({ defaultLayout: 'main', extname: '.hbs' })
);
app.set('view engine', '.hbs');

// load session and make sure to put
// middleware above passport
app.use(
	session({
		secret: 'dumbledore',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

// set passport middleware
app.use(passport.initialize());
app.use(passport.session());

// create static folders
app.use(express.static(path.join(__dirname, 'public')));

// Link your routes
app.use('/', routes);
app.use('/auth', auth);

// create a port for server to listen on
const PORT = process.env.PORT || 3000;

// server listens to port
app.listen(
	PORT,
	console.log(`server runs on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
