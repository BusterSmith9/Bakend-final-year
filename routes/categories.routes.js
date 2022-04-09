const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Category = require("../models/categories.model");

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
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(400).json({ success: false })
  }
  res.status(200).send(categoryList);
})


router.post("/", upload.single('categoryImage'), (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    categoryImage: req.file.path
  });
  category
    .save()
    .then(result => {
      console.log({ result });
      res.status(201).json({
        message: "Created category successfully",
        createdCategory: {
          name: result.name,
          description: result.description,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:4001/categories/" + result._id
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
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(400).json({ message: "this category with the given id does not exist" })
  }
  res.status(200).send(category);
});

router.put('/:id', async (req,res, next) => {

    const category= await Category.findById(req.params.id);

    if (!category){
      return res.status(400).send('invalid');
  
    }

    category.name=req.body.name;
    category.description=req.body.description;

  res.send(category);
  
});

router.delete('/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id).then(category => {
    if (category) {
      return res.status(200).json({ success: true, message: 'the category is deleted' })
    } else {
      return res.status(400).json({ success: false, message: 'category cannot be found' })
    }

  }).catch(err => {
    return res.status(400), json({ success: false, error: err })
  })
})


module.exports = router;