const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const expressHandleBars = require('express-handlebars');
const methodOverride = require('method-override');
const login = require('./routes/index');
const stories = require('./routes/stories');
const auth = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

//load dotenv file
dotenv.config({ path: './config/config.env' });

// load passport
require('./config/passport')(passport);

//connect your DB
connectDB();

// initialize express
const app = express();

//initialize body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.disable('etag');

//initialize method override for put
app.use(
	methodOverride((req, res) => {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			let method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

//Use morgan for logging any client request error
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//Handlebar helper
const {
	formatDate,
	stripTags,
	truncate,
	editIcon,
	passUserData,
	select,
} = require('./helpers/hbs');
// const { delete } = require('./routes/index');

// Intialize handlebars
app.engine(
	'.hbs',
	expressHandleBars({
		helpers: {
			formatDate,
			stripTags,
			truncate,
			editIcon,
			passUserData,
			select,
		},
		defaultLayout: 'main',
		extname: '.hbs',
	})
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
app.use((req, res, next) => {
	res.locals.user = req.user; // This is the important line
	next();
});

//set global variables
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

// create static folders
app.use(express.static(path.join(__dirname, 'public')));

// Link your routes
app.use('/', login);
app.use('/auth', auth);
app.use('/stories', stories);

// create a port for server to listen on
const PORT = process.env.PORT || 3000;

// server listens to port
app.listen(
	PORT,
	console.log(`server runs on ${process.env.NODE_ENV} mode on port ${PORT}`)
);
