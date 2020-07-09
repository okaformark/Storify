const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');
// @desc login/landing page
// @route '/GET'
router.get('/', ensureGuest, (req, res) => {
	res.render('login', { layout: 'login' });
});

// @desc login/landing page
// @route '/GET'
router.get('/dashboard', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ user: req.user.id }).lean();
		const user = await User.findById({ _id: req.user.id }).lean();
		console.log('my user', user);
		res.render('dashboard', {
			user,
			stories,
		});
	} catch (error) {
		console.error('error', error);
		res.render('error/500');
	}
});

module.exports = router;
