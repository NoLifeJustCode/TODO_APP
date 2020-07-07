const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/Task')
const db=mongoose.connection
db.on('error',console.error.bind(console,'error in connecting'))
db.once('open',function(event){
    console.log('successfull connection')
})