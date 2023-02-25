const express = require('express')
const mongoose = require('mongoose')
const port = process.env.PORT || 8000

const app = express()
app.use(express.json());
const AuthRouter = require('./routes/auth')
const UserRouter = require('./routes/user')

app.use(AuthRouter)
app.use(UserRouter)

const connectionURL = 'mongodb://127.0.0.1:27017/node-auth-template'

mongoose.connect(connectionURL,{useNewUrlParser : true , useUnifiedTopology : true},(err) => {
  if(err) console.log("Unable to connect to the database")
  else console.log("Database connected sucessfully")
})



app.listen(port,() => console.log("Server started on port " + port))

