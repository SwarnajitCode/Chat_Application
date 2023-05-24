const socket = io('http://localhost:5500');

/*const io = require("socket.io-client");
socket.current = io("http://localhost:5500/");*/
let room =''
const romm = {}
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const roomInput = document.getElementById('roomInp');
const joinButton = document.getElementById('room-button')
const messageContainer = document.querySelector(".container")   

const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}
$(document).ready(function() {

$('#myTable').on('click','tr', function(){
    console.log('you clicked me');
    rm = $( this ).text()
    room = rm
    localStorage.setItem('room', room);
    romm.roo = room
    socket.emit('join-room',room)

    // trying to receive the related messages
      $.ajax({
        url:"http://localhost:5500/getmessage",
        method:"POST",
        contentType:"application/json",
        data: JSON.stringify({room}),
        success: (res)=>{
            for(let i=0;i<res.length;i++){
                append(res[i],'left')
                socket.to(room).emit('receive',{message: message, name: users[socket.id]})
            }
        }
    }) 


    const name = prompt("Enter your name to join");
    socket.emit('new-user-joined', name);
    window.location = `http://localhost:5500/view/?name=${rm}`
});
})

/*joinButton.addEventListener("click", () =>{
    const room = roomInput.value
    socket.emit('join-room',room)
})*/

form?.addEventListener('submit', (e)=>{
    e.preventDefault()
    const message = messageInput.value
    

     // trying to save the message 
     room = localStorage.getItem('room')
     $.ajax({
        url:"http://localhost:5500/message",
        method:"POST",
        contentType:"application/json",
        data: JSON.stringify({room,message}),
        success: (res)=>{
             //const info = JSON.stringify(res)
             //console.log(info)
        }
    })  

    append(`You: ${message}`, 'right')
    socket.emit('send',message,room)
    messageInput.value = ''
    roomInput.value = ''
})

/*const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);*/

socket.on('user-joined', name =>{
append(`${name} joined the chat`,'right')
})

socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`,'left')
})

socket.on('left', name =>{
    append(`${name} left the chat`,'left')
})    


