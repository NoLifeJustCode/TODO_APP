const mongoose=require('mongoose')
const settingSchema=new mongoose.Schema({
    Time:{
        default:'00:00',
        type:String
    },
    Date:{
        default:0,
        type:Number
    },
    dark_mode:{
        default:false,
        type:Boolean        
    },
    Time_offset:{
        default:false,
        type:Boolean
    },
    Date_offset:{
        default:false,
        type:Boolean
    }
})

const settingModel=mongoose.model('Setting',settingSchema)
module.exports=settingModel

