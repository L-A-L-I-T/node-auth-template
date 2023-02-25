const express = require('express')
const router = express.Router()
const User = require('../db/models/user')
const auth = require('../middlewares/auth')

router.get('/users',auth,async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router;