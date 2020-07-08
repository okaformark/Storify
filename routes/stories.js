const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

//@desc show add story page
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
	res.render('stories/add');
});

//@desc post stories
//@route POST TO /stories
router.post('/', ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.redirect('/dashboard');
	} catch (error) {
		console.error('error', error);
		res.render('error/500');
	}
});

//@desc display all stories
//@route GET /stories
router.get('/', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({ status: 'public' })
			.populate('user')
			.sort({ createdAt: 'desc' })
			.lean();
		res.render('stories/index', { stories });
		console.log(stories);
		console.log(stories.length);
	} catch (error) {
		console.error('error', error);
		res.render('error/500');
	}
});

module.exports = router;
