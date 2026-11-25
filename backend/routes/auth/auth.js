const express = require("express");
 const router = express.Router()
// controller
const { register, login, logout ,getMe } = require('../../controllers/auth.controller')
const { getProfile } = require('../../controllers/profile.controller')

// middleware
const { verifyToken } = require('../../middleware/auth.middleware')

router.post("/register", register )
router.post("/login",login )
router.post("/logout", logout)
router.get("/me", verifyToken, getMe);
router.get("/user", verifyToken, getProfile )

 module.exports =router

