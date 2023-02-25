const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
    },
    tokens : [{
        token : {
            type : String,
            required : true,
        }
    }],
},{timestamps : true})

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id : user._id.toString()} , "node-auth-template")

    user.tokens = user.tokens.concat({token})

    await user.save()
    
    return token
}

userSchema.methods.getPublicProfile = function(){
    const user = this

    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    console.log(userObject)

    return userObject

}



module.exports = mongoose.model('User',userSchema)


