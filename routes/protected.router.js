const {Router} = require("express");
const User = require("../models/User");


const router = Router()

router.use('/user', require('./user.router'));
router.use('/transactions', require('./transactions.router'));



module.exports = router;
