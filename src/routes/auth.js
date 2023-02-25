const express = require('express')
const validator = require('validator')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../db/models/user')
const auth = require('../middlewares/auth')

router.post('/login',async (req,res) => {
    const {email , password} = req.body;
    if(!validator.isEmail(email)) return res.status(400).send("Please enter valid Email")
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(401).send("No such account exists")
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(401).send('Invalid Credentials')
        const token = await user.generateAuthToken()
        res.send({user : user.getPublicProfile(),token})
    }
    catch(e) {
        res.status(400).send(e)
    }
    
})


router.post('/signup',auth,async (req,res) => {

    const user = new User(req.body)
    
    try{
        const hashedPassword = await bcrypt.hash(user.password , 8)
        console.log(hashedPassword)
        user.password = hashedPassword
        await user.save()
        console.log('user saved')
        const token = await user.generateAuthToken()
        console.log(token)
        res.status(201).send({user,token})
    }
    catch (e){
        console.log(e.message)
        if(e.message.indexOf("11000") != -1) return res.status(400).send("Account already Exists!!")
        res.status(400).send(e)
    }
})


router.post('/logout',auth,async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})



module.exports = router;