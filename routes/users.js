var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');
let slugify = require('slugify');

// GET all users
router.get('/', async function(req, res, next) {
  try {
    let data = await userModel.find({
      isDeleted: false
    }).populate('role');
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET user by ID
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      isDeleted: false,
      _id: id
    }).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(404).send({
      message: error.message
    });
  }
});

// CREATE new user
router.post('/', async function(req, res, next) {
  try {
    let newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: req.body.role
    });
    await newUser.save();
    await newUser.populate('role');
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// UPDATE user
router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    ).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// DELETE user (soft delete)
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(
      id, 
      { isDeleted: true }, 
      { new: true }
    ).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

module.exports = router;
