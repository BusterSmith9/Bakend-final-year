const bcrypt = require("bcryptjs");
const userServices = require("../services/user.services");
const User = require('../models/user.model')

/**
 * 1. To secure the password, we are using the bcryptjs, It stores the hashed password in the database.
 * 2. In the SignIn API, we are checking whether the assigned and retrieved passwords are the same or not using the bcrypt.compare() method.
 * 3. In the SignIn API, we set the JWT token expiration time. Token will be expired within the defined duration.
 */
exports.register = (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  userServices.register(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.users = async (req, res, next) => {
  const usersList = await User.find({role: 1});
  if (!usersList) {
    res.status(400).send('No users registered')
    return;
  }
  res.status(200).send(usersList);

}

exports.login = (req, res, next) => {
  const { username, password } = req.body;

  console.log(`username: ${username} password: ${password}`)
  userServices.login({ username, password, role: 1 }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.totalCount = async (req, res, next) => {

  const count = await User.countDocuments({role: 1});
  console.log(`count: ${count}`)

  if(count == 0)
  {
      res.status(200).send({'message': 'No Blogs Found'});
      return;
  }

  if (!count) {
    res.status(400).json({ success: false })
  }
  res.status(200).send({ 'count': count });

}

exports.adminLogin = (req, res, next) => {
  const { username, password } = req.body;

  userServices.login({ username, password, role: 0 }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.userProfile = (req, res, next) => {
  return res.status(200).json({ message: "Authorized User!!" });
};

exports.otpLogin = (req, res, next) => {
  userServices.createOtp(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};

exports.verifyOTP = (req, res, next) => {
  userServices.verifyOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Success",
      data: results,
    });
  });
};
