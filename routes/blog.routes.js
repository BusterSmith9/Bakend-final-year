const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Place = require("../models/places.model");


router.get('/', async (req, res) => {
    const blogList = await Blog.find().populate({ path: 'place', populate: { path: 'category' } }).populate('user');

    if (!blogList) {
        res.status(400).json({ success: false })
    }
    res.status(200).send(blogList);
})

router.get('/totalCount', async (req, res) => {
    const count = await Blog.countDocuments({});
    console.log(`count: ${count}`)

    if(count == 0)
    {
        res.status(200).send({'message': 'No Blogs Found'});
        return;
    }
  
    if (!count) {
      res.status(400).json({ success: false }).send('No Blogs found')
    }
    res.status(200).send({ 'count': count });
  })



router.post("/", async (req, res, next) => {
    const user = await User.findById(req.body.user);
    console.log(req.body);
    if (!user) return res.status(400).send('Invalid user')
    const place = await Place.findById(req.body.place);
    if (!place) return res.status(400).send('Invalid place name')

    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        blogTitle: req.body.blogTitle,
        blogDescription: req.body.blogDescription,
        user: req.body.user,
        place: req.body.place,
    });
    blog
        .save()
        .then(result => {
            console.log({ result });
            res.status(201).json({
                message: "Created blog successfully",
                createdBlog: {
                    blogTitle: result.blogTitle,
                    blogDescription: result.blogDescription,
                    user: result.user,
                    place: result.place,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:4001/blog/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', async (req, res) => {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).json({ success: false, message: 'Invalid blog id' })
    }
    const blog = await Blog.findById(req.params.id).populate({ path: 'place', populate: { path: 'category' } }).populate('user');

    if (!blog) {
        res.status(400).json({ message: "this blog with the given id does not exist" })
    }
    res.status(200).send(blog);
});

router.put('/:id', async (req, res) => {
    console.log(req.body)
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body
        },

    )
    console.log(blog)
    if (!blog)
        return res.status(500).send('the blog cannot be updated')
    const newBlog = await Blog.findById(req.params.id)

    res.send(newBlog);
})

router.delete('/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id).then(blog => {
        if (blog) {
            return res.status(200).json({ success: true, message: 'the blog is deleted' })
        } else {
            return res.status(400).json({ success: false, message: 'blog cannot be found' })
        }

    }).catch(err => {
        return res.status(400), json({ success: false, error: err })
    })
});

module.exports = router;
