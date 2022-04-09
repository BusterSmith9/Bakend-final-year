const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Place = require("../models/places.model");
const Category = require("../models/categories.model");
const { count } = require("../models/categories.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.get('/', async (req, res) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') }
  }
  const placeList = await Place.find(filter).populate('category');

  if (!placeList) {
    res.status(400).json({ success: false })
  }
  res.status(200).send(placeList);
})


router.post("/", upload.single('placeImage'), async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category')

  const place = new Place({
    _id: new mongoose.Types.ObjectId(),
    placeName: req.body.placeName,
    placeDescription: req.body.placeDescription,
    placeImage: req.file.path,
    recentlyAdded: req.body.recentlyAdded,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    totalLikes: req.body.totalLikes,
    category: req.body.category,
  });
  place
    .save()
    .then(result => {
      console.log({ result });
      res.status(201).json({
        message: "Created place successfully",
        createdPlace: {
          placeName: result.placeName,
          placeDescription: result.placeDescription,
          recentlyAdded: result.recentlyAdded,
          latitude: result.latitude,
          longitude: result.longitude,
          totalLikes: result.totalLikes,
          category: result.category,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/places/" + result._id
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
  console.log(`params id: ${req.params.id}`)
  const place = await Place.findById(req.params.id).populate('category');


  if (!place) {
    res.status(400).json({ message: "this place with the given id does not exist" })
  }
  res.status(200).send(place);
})

router.get('/category/:id', async (req, res) => {
  console.log(`params id: ${req.params.id}`)
  const place = await Place.find({ category: req.params.id }).populate('category');


  if (!place) {
    res.status(400).json({ message: "this place with the given id does not exist" })
  }
  res.status(200).send(place);
})

router.get('/:id', async (req, res) => {
  console.log(`params id: ${req.params.id}`)
  const place = await Place.find({ category: req.params.id }).populate('category');


  if (!place) {
    res.status(400).json({ message: "this place with the given id does not exist" })
  }
  res.status(200).send(place);
})

router.put('/:id', async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category')
  const place = await Place.findByIdAndUpdate(
    req.params.id,
    {
      placeName: req.body.placeName,
      placeDescription: req.body.placeDescription,
      placeImage: req.file.path,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      totalLikes: req.body.totalLikes,
      category: req.body.category,
    },
    { new: true }
  )
  if (!place)
    return res.status(500).send('the place cannot be updated')

  res.send(place);
})

router.delete('/:id', (req, res) => {
  Place.findByIdAndRemove(req.params.id).then(place => {
    if (place) {
      return res.status(200).json({ success: true, message: 'the category is deleted' })
    } else {
      return res.status(400).json({ success: false, message: 'category cannot be found' })
    }

  }).catch(err => {
    return res.status(400), json({ success: false, error: err })
  })
})

router.get(`/get/count`, async (req, res) => {
  const placeCount = await Place.countDocuments();

  if (!placeCount) {
    res.status(400).json({ success: false })
  }
  res.send({
    placeCount: placeCount
  });
});

router.get(`/get/recentlyAdded/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0
  const places = await Place.find({ recentlyAdded: true }).limit(+count);

  if (![places]) {
    res.status(400).json({ success: false })
  }
  res.send(places);

});

module.exports = router;