const express = require("express");
const router = express.Router();


const {createUser, getUser, loginUser, getAllUsers, logout}= require('../controllers/userController');
const { verifyToken } = require("../middleware/verifyToken");

router.post('/user-register', createUser);
router.post('/login-user', loginUser);
router.get('/get-user', getUser);
router.post('/getalluser', getAllUsers);
router.post('/logout', verifyToken,logout);
module.exports =router;