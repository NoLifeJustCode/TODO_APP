var PriorityVisible=false;
var init_data=null
const priorityMap={
    'low':3,
    'medium':2,
    'high':1
}
const addTaskUrl='/addTask'
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
var isDarkMode=false;
function getDate(){
   var _date=new Date();
   if(!init_data.Date_offset)
    _date.setDate( init_data.Date)
    else
    _date.setDate(_date.getDate()+init_data.Date)
    
   var date=_date.getFullYear()+'-'+(_date.getMonth()+1).toString().padStart(2,'0')+'-'+_date.getDate().toString().padStart(2,'0');
   console.log(date);
   return date;
}
function getTime(){
    var _date=new Date();
    if(!init_data.Time_offset){
        return init_data.Time;
    }
    var time=(parseInt(init_data.Time.split(":")[0])*60*60*1000)+(parseInt(init_data.Time.split(":")[1])*60*1000)
    _date.setTime(_date.getTime()+time)
    return _date.getHours().toString().padStart(2,'0')+":"+_date.getMinutes().toString().padStart(2,'0')
}
function setup(){
    console.log('setup')
    $.get('/init',function(data){
        init_data=data;
        console.log(init_data)
        isDarkMode=init_data.dark_mode
        if(location.href.endsWith('setting'))
            settingInit()
        else
            init()
    })
    
}
function settingInit(){
    document.getElementById('dark_mode').onchange=switch_mode
    
}
function init(){
  document.getElementById('Date').value=getDate()
  document.getElementById('time').value=getTime()
   let value=setInterval(function(){
    document.getElementById('time').value=getTime()
   },1000*60);
  document.getElementsByClassName('drpdwnContent')[0].addEventListener('click',togglePriority)
  document.getElementById('addTask').addEventListener('click',addTask)
}
function makePriorityVisible(event){
    
    let element=document.getElementsByClassName('drpdwnContent')[0]
    for(var i of element.children){
        i.classList.remove('hide');
    }
}
function priorityHide(event){
    let element=document.getElementsByClassName('drpdwnContent')[0]
    for(var i of element.children){
        if(i==event.toElement)
            continue;
        i.classList.add('hide')
    }
}
function togglePriority(event){
    if(PriorityVisible)
        priorityHide(event)
    else
        makePriorityVisible(event)
    PriorityVisible=!PriorityVisible;

}
function addTask(event){
    event.preventDefault()
    console.log(event)
    let element=document.getElementsByClassName('drpdwnContent')[0]
   
    var priority=null
    for(var i of element.children)
        if(!i.classList.contains('hide'))
            priority=i.getAttribute('value');
    priority=priorityMap[priority]
    var data={
    'priority':priority,
    'Date':document.getElementById('Date').value,
    'Time':document.getElementById('time').value,
    'Title':document.getElementById('Title').value    
    }
    console.log(data)
    $.post(addTaskUrl,{'data':data},function(data){
        console.log('successfully added')
        location.reload()
    })
}
function mode(current_mode,new_mode){
     document.body.classList.remove(current_mode.main_bg)   
     document.body.classList.add(new_mode.main_bg)
     var links_tag=document.querySelectorAll('.container a')
     for(var i of links_tag){
         i.classList.remove(current_mode.color_font)
         i.classList.add(new_mode.color_font)
     }
     document.getElementById('settingForm').classList.remove(current_mode.color_font)
     document.getElementById('settingForm').classList.add(new_mode.color_font)
     var tasks=document.getElementsByClassName('Task')
     for(var i of tasks){
         i.classList.remove(current_mode.task_bg)
         i.classList.add(new_mode.task_bg)
     }
     var aside=document.getElementsByTagName('aside')[0]
     aside.classList.remove(current_mode.task_bg)
     aside.classList.add(new_mode.task_bg)
}
function switch_mode(){
    if(isDarkMode)
        mode(dark_mode,normal_mode)
    else
        mode(normal_mode,dark_mode)
    isDarkMode=!isDarkMode
    
}
window.onload=setup()
