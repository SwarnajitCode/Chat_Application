const {sequelize} = require('./models')
const path = require('path')
let cors = require('cors')
const express = require('express')
const app = express()
const session = require('express-session')
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const userchatRouter = require("./routers/userchat.router");
const io = new Server(server,{
    cors:{
        origin:'*',
    }
})

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
app.use('/',userchatRouter)




const users = {}
io.on('connection', socket =>{
    //console.log('socket rooms',socket.rooms)
   // console.log('socket',socket.id)
    socket.on('new-user-joined',name =>{
        users[socket.id] = name;
       // console.log(name,":",socket.id)
        socket.broadcast.emit('user-joined',name)
    });

    socket.on('send',(message,room) =>{
        if(room === ''){
            socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
        }else{
            socket.to(room).emit('receive',{message: message, name: users[socket.id]})
        }
        
    });

    socket.on('disconnect',message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
    socket.on('join-room',room =>{
        //console.log('now fired')
       socket.join(room)
    });
    
})
server.listen(5500, async()=> {
    console.log('server running')
    await sequelize.sync()
})