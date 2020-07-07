const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
    task_desc:{
        type:String,
        required:true
    
    },
    Due_Date:{
        type:Date,
        required:true,

    },
    priority:{
        type:Number,
        default:3
    },
    created_Date:{
        type:Date,
        default:Date.now(),
    },
    Completed:{
        type:Boolean,
        required:true,
        default:false
    },
    Time:{
        type:String,
        required:true
    }
})
taskSchema.methods.findTasksByDate=function(cb){
    return this.model('Tasks').find({
        Due_Date:this.Due_Date
    },cb);
}
taskSchema.methods.findTasksInProgress=function(){
    this.model('Tasks').find({
        Due_Date:{ $gt:Date.now() }
    }).then((err,Tasks)=>{
        if(err){
            console.error.bind(console,'Error querying \n'+err)
            return;
        }
        return Tasks;
    })
}
const Task=mongoose.model('Tasks',taskSchema);
module.exports=Task;