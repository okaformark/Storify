const express = require('express');
const router = express.Router();
const passport = require('passport');

// @desc authenticate with google
// @route GET TO /AUTH/GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc callback with google
// @route GET TO /auth/google/callback
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/dashboard');
	}
);

module.exports = router;
