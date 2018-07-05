
var socket = io.connect('http://twopics.herokuapp.com');
//var socket = io.connect('http://localhost:3000');

var msg = document.getElementById('feedbck');
var btn = document.getElementById('submit-ans');
var input = document.getElementById('input-ans');
var usrID = document.getElementById('user-id');
var ul = document.getElementById('ans-feed')
var userPoints = document.getElementById('user-points');
var userThumb = document.getElementById('user-thumb');
var feed = document.getElementById('feed');
var parentDiv = feed.parentNode;

btn.addEventListener('click',()=>{
  if(!input.value){
    alert('answer field is empty')
  }else{
    let input = input.value.toLowerCase();
    socket.emit('post',{body:input,username:usrID.value,userThumb:userThumb.value,points:userPoints.value,time:new Date()});
    input.value = ``;
  }
})

input.addEventListener('keypress',()=>{
  socket.emit('typing',usrID.value);
})

socket.on('typing',(data)=>{
  msg.innerHTML = `<p id='feedback'>${data} is typing....</p>`
})

socket.on('feedHistory',(data)=>{
  ul.innerHTML =``;
  data.forEach((data)=>{
    var newPost = document.createElement('li');
    var hr =new Date(data.time).getHours();
    var min=new Date(data.time).getMinutes();
    newPost.innerHTML = `
        <p id='time-stamp'>${hr}:${min}</p>
        <img id='prof-thumb' src='${data.thumb}'/>
        <p id='user-ans'>${data.body}</p>
        <p id='user-info'>${data.points}|${data.username}</p>
    `
    parentDiv.insertBefore(newPost,feed.nextSibling);
  })
})

socket.on('post',(data)=>{
  var newPost = document.createElement('li');
  input.value = ``
  msg.innerHTML = ``
  var hr =new Date(data.time).getHours();
  var min=new Date(data.time).getMinutes();
  newPost.innerHTML = `
      <p id='time-stamp'>${hr}:${min}</p>
      <img id='prof-thumb' src='${data.userThumb}'/>
      <p id='user-ans'>${data.body}</p>
      <p id='user-info'>${data.points}|${data.username}</p>
  `
  parentDiv.insertBefore(newPost,feed.nextSibling);
})
