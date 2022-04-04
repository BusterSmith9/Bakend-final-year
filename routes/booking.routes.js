const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Booking = require("../models/booking.model");

const User = require("../models/user.model");

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
  const bookingList = await Booking.find().populate('user');

  if (!bookingList) {
    res.status(400).json({ success: false })
  }
  res.status(200).send(bookingList);
})


router.post("/", upload.single('vehicleImage'), async(req, res, next) => {
  const user = await User.findById(req.body.user);
  if(!user) return res.status(400).send('Invalid Category')

  const booking = new Booking({
    _id: new mongoose.Types.ObjectId(),
    vehicleName: req.body.vehicleName,
    vehicleNumber: req.body.vehicleNumber,
    vehicleImage: req.file.path,
    vehicleDescription: req.body.vehicleDescription,
    Price: req.body.Price,
    user: req.body.user,
  });
  booking
    .save()
    .then(result => {
      console.log({ result });
      res.status(201).json({
        message: "Created place successfully",
        createdBooking: {
          vehicleName: result.vehicleName,
          vehicleNumber: result.vehicleNumber,
          vehicleDescription: result.vehicleDescription,
          Price: result.Price,
          user: result.user,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:4001/booking/" + result._id
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
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(400).json({ message: "this place with the given id does not exist" })
  }
  res.status(200).send(booking);
})

router.delete('/:id', (req, res) => {
  Booking.findByIdAndRemove(req.params.id).then(booking => {
    if (booking) {
      return res.status(200).json({ success: true, message: 'the booking is deleted' })
    } else {
      return res.status(400).json({ success: false, message: 'booking cannot be found' })
    }

  }).catch(err => {
    return res.status(400), json({ success: false, error: err })
  })
})


module.exports = router;
