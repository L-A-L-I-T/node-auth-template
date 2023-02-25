const jwt = require('jsonwebtoken')
const User = require('../db/models/user')
const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)
        const decoded = jwt.verify(token,'node-auth-template')
        const user = await User.findOne({ _id : decoded._id , 'tokens.token' : token})

        if(!user) throw new Error()
        req.user = user
        req.token = token
        next()

    }
    catch(e){
        res.status(401).send({error : "Please Authenticate"})
    }
}

module.exports = auth