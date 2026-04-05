var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles
router.get('/', async function(req, res, next) {
  try {
    let data = await roleModel.find({
      isDeleted: false
    });
    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
});

// GET role by ID
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({
      isDeleted: false,
      _id: id
    });
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

// GET all users in a role
router.get('/:id/users', async function(req, res, next) {
  try {
    let id = req.params.id;
    
    // Check if role exists
    let role = await roleModel.findOne({
      isDeleted: false,
      _id: id
    });
    
    if (!role) {
      return res.status(404).send({
        message: "ROLE NOT FOUND"
      });
    }
    
    // Get all users with this role
    let users = await userModel.find({
      isDeleted: false,
      role: id
    }).populate('role');
    
    res.send({
      role: role,
      users: users,
      total: users.length
    });
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// CREATE new role
router.post('/', async function(req, res, next) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.status(201).send(newRole);
  } catch (error) {
    res.status(400).send({
      message: error.message
    });
  }
});

// UPDATE role
router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    );
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

// DELETE role (soft delete)
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findByIdAndUpdate(
      id, 
      { isDeleted: true }, 
      { new: true }
    );
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
