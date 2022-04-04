const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/reviews.model");
const User = require("../models/user.model");
const Place = require("../models/places.model");


router.get('/', async (req, res) => {
  const reviewList = await Review.find().populate('place');

  if (!reviewList) {
    res.status(400).json({ success: false })
  }
  res.status(200).send(reviewList);
})


router.post("/", async(req, res, next) => {
  const user = await User.findById(req.body.user);
  if(!user) return res.status(400).send('Invalid user')
  const place = await Place.findById(req.body.place);
  if(!place) return res.status(400).send('Invalid place name')

  const review = new Review({
    _id: new mongoose.Types.ObjectId(),
    review: req.body.review,
    rating: req.body.rating,
    user: req.body.user,
    place: req.body.place,
  });
  review
    .save()
    .then(result => {
      console.log({ result });
      res.status(201).json({
        message: "Created review successfully",
        createdReview: {
          review: result.review,
          rating: result.rating,
          user: result.user,
          place: result.place,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:4001/review/" + result._id
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
  const review = await Review.findById(req.params.id).populate('place');

  if (!review) {
    res.status(400).json({ message: "this place with the given id does not exist" })
  }
  res.status(200).send(review);
});

router.put('/:id', async (req,res, next) => {
  const review= await Review.findByIdAndUpdate(
    req.params.id,
    {
      review:req.body.review,
      rating:req.body.rating, 
    }
  )
  if (!review)
  return res.status(400).send('invalid')

  res.send(review);
  
});



module.exports = router;
