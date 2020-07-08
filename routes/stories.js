const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story');

//@desc show add story page
//@route GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
	return res.render('stories/add');
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
		return res.render('error/500', error);
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
		return res.render('error/500', error);
	}

	//@desc display single story
	//@route GET stories/:id
	router.get('/:id', ensureAuth, async (req, res) => {
		try {
			let story = await Story.findById({ _id: req.params.id })
				.populate('user')
				.lean();
			if (!story) {
				return res.render('error/404');
			}
			res.render('stories/show', { story });
		} catch (error) {
			return res.render('error/500', error);
		}
	});

	//@desc get individual user story
	//@route GET
	router.get('/edit/:id', ensureAuth, async (req, res) => {
		try {
			const story = await Story.findOne({
				_id: req.params.id,
			}).lean();
			if (!story) {
				return res.render('error/404');
			}
			if (story.user != req.user.id) {
				res.redirect('/stories');
			} else {
				res.render('stories/edit', {
					story,
				});
			}
		} catch (error) {
			return res.render('error/500', error);
		}
	});
});

//@DESC UPDATE STORIES
// PUT STORIES/:ID
router.put('/:id', ensureAuth, async (req, res) => {
	try {
		let story = await Story.findById(req.params.id).lean();
		if (!story) {
			return res.render('error/404');
		}
		if (story.user != req.user.id) {
			res.redirect('/stories');
		} else {
			story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
				new: true,
				runValidators: true,
			});
			res.redirect('/dashboard');
		}
	} catch (error) {
		return res.render('error/500', error);
	}
});

//@desc delete story
//@route DELETE stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
	try {
		await Story.remove({ _id: req.params.id });
		res.redirect('/dashboard');
	} catch (error) {
		res.render('error/500', error);
	}
});

//@desc get user stories
//@route GET /stories/user/:userId
router.get('/user/:userid', ensureAuth, async (req, res) => {
	try {
		const stories = await Story.find({
			user: req.params.userId,
			status: 'public',
		})
			.populate('user')
			.lean();
		res.render('stories/index', { stories });
	} catch (error) {
		console.error('error', error);
		return res.render('error/500', error);
	}
});
module.exports = router;
