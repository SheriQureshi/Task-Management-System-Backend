const models = require("../models");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await models.User.create({
      username,
      email,
      password:hashedPassword,
      role,
    });

    //res.status(200).json("user registered successfully: ",newUser);
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json(error.message);
  }
};

const loginUser = async (req, res) => {
    try { 
      let { email, password } = req.body;
      //console.log(req.body.userId)
      const user = await models.User.findOne({ where: { email } });
     console.log(user)
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }else{
        const matchPassword = await bcrypt.compare(password, user.password);
        if (matchPassword) {
          const token = jwt.sign({ userId: req.body.userId}, "HMAC-SHA1");
          let { email } = user;
          res.status(200).json({ email, token, user});
         
       
          return;
        } else {
          res.status(401).json({ message: "invalid password" });
        }}
      
    } catch (error) {
      console.error("Error during password comparison:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
const getUser = async (req, res) => {
  try {

    const users = await models.User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    const requestingUser = await models.User.findByPk(req.body.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Fetch only regular users (not managers or admins)
    const users = await models.User.findAll({
      where: {
        role: 'user',
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const logout=  async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;

    // If the token is not provided, return an error
    if (!token) {
      return res.status(400).json({ message: 'Token is required for logout' });
    }

    // Find the user based on the token
    // Note: You are not checking based on 'token' column now
    const user = await models.User.findOne();

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Destroy or invalidate the token (you might want to implement token revocation logic)
    // Here, we are not checking the 'token' column
    user.token = null;

    // Save the updated user to the database
    await user.save();

    // Send a success response
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }}

module.exports = { createUser, getUser , loginUser, getAllUsers, logout};
