const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');

//@desc get user info
//@route GET /userprofile
router.get('/', ensureAuth, async (req, res) => {
	const userProfile = await User.findById({ _id: req.user.id }).lean();
	console.log(userProfile, 'uuuuuuuuuuuu');
	try {
		if (!userProfile) {
			return res.render('error/500');
		}
		res.render('Profile/userProfile', { userProfile });
	} catch (error) {
		res.render('error/500');
	}
});

module.exports = router;
