const express=require('express')
const path=require('path')
const port=3000
const db=require('./config/mongoose_config')
const Setting=require('./model/settingdb')
const Task=require('./model/Taskdb')
const app=express();
const priorityMap={
    'low':3,
    'medium':2,
    'high':1
}
const symbol={
    1:'!!!',
    2:'!!',
    3:'!',
}
const normal_mode={
    main_bg:"teal",
    color_font:"blackFont",
    task_bg:"teal_task"
}
const dark_mode={
    main_bg:"blackBg",
    color_font:"whiteFont",
    task_bg:"violetBg"
}
const all_links={
            title:'Todo_app',
            Home:'/',    
            all_tasks:'/all_tasks',
            completed_tasks:'/completed',
            setting:'/setting'
} 
var color_mode=normal_mode
/*
 *Middlewares   
*/
app.use(express.static('assets'))
app.use(express.urlencoded())
/*
 *Setting up express attributes
 */

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
/*
 *Router Controllers and Server connection handlers   
 */
app.listen(port,function(err){
    if(err){
        return console.log(err)
    }
    init()
   
    
    console.log('server running successful')
    console.log(Setting)
})
/*
 *Routing Controllers
 */
function init(){
    Setting.find({},function(err,data){
        if(err){
            return;
        }
        if(data.length==0){
            Setting.create({})
        }else{
            console.log(data.length)
        }
    })
}
/*
 * Router to return initiliazing data
 */
app.get('/init',function(req,res){
    Setting.find({},function(err,data){
        if(err){
            return;
        }
        return res.send(data[0]);
    })
})
/*
 * home page
 */
app.get('/',function(req,res){
    var _date=new Date()
    var start=new Date(_date.getFullYear(),_date.getMonth(),_date.getDate()).setHours('00','00','00')
    var end=new Date(_date.getFullYear(),_date.getMonth(),_date.getDate()).setHours('59','59','59') 
    var setting_data=Setting.find({})
    setting_data.then((data_set)=>{
        Task.find({Completed:false,Due_Date:{
        $gte:start, $lte:end,
        }}).sort({Due_Date:'asc'}).exec(function(err,data){
            console.log(symbol[1],data)
            if(err)
            {
                console.log(err)
                return;
            }
            
            if(data_set[0].dark_mode)
                color_mode=dark_mode
            else
                color_mode=normal_mode
            console.log('data',data_set);
            res.render('home',{
            links:all_links,
            task:data,
            priority_symbol:symbol,
            color_pallete:color_mode    
        })
    })
})
    //console.log(supportFuncs.getTime())
    
});
/*
 * add Task router to add to db
 */
app.post('/addTask',function(req,res){
    let data=req.body.data
    console.log("priority",data.priority,priorityMap[data.priority.toString])
    Task.create({
        task_desc:data.Title,
        Due_Date:data.Date,
        Time:data.Time,
        priority:data.priority

    }).then((data)=>{
        console.log(data)
        res.redirect('back')
    })
})
/*
 *Delete documents
 */
app.get('/delete/:id',function(req,res){
    
    Task.findByIdAndDelete(req.params.id).then((data)=>{
        console.log(data)
        res.redirect('back')
    })
    
})
/*
 * modify data 
 */
app.get('/modify/:id',function(req,res){
    Task.findByIdAndUpdate(req.params.id,{Completed:true}).then(data=>{
        console.log(data)
        res.redirect('back')
    })
})
/*
 * get Completed Tasks
 */
app.get('/completed',function(req,res){
    Task.find({Completed:true},function(err,data){
        console.log(err,data)
        res.render('completed_task',{
            links:all_links,
            task:data,
            priority_symbol:symbol,
            color_pallete:color_mode    
        })
    })
    
})
/*
 *   get All tasks
 */
app.get('/all_tasks',function(req,res){
    Task.find({}).sort({Completed:'desc',Due_Date:'asc'}).exec((err,data)=>{
        if(err){
            return res.status(400).send('error')
        }
        return res.render('all_tasks',{
            links:all_links,
            task:data,
            priority_symbol:symbol,
            color_pallete:color_mode    
        })
    })
})
/*
 *  customize certain aspects of the page
 */
app.get('/setting',function (req,res){
    Setting.find({},function(err,data_set)
        {
            console.log(data_set)
        res.render('setting',{
        links:all_links,
        priority_symbol:symbol,
        setting:data_set[0],
        color_pallete:color_mode
        })

})
})
/*
 * write settings to db
 */
app.post('/setting',function(req,res){
    var settingSchema={
        Time:req.body.time,
        Date:req.body.Date,
        Time_offset:false,
        Date_offset:false,
        dark_mode:false
    }
    if(req.body.Time_offset)
        settingSchema['Time_offset']=true;
    if(req.body.Date_offset)
        settingSchema['Date_offset']=true;
    if(req.body.dark_mode)
        settingSchema['dark_mode']=true;
    
    if(settingSchema['dark_mode'])
        color_mode=dark_mode
    else
        color_mode=normal_mode    
    Setting.updateMany({},settingSchema,function(err,data){
            res.redirect('back')
    })
    
        
})
