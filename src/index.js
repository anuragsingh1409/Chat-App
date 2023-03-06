const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app= express()
const server = http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

let message='Welcome!';

io.on('connection',(socket)=>{
    console.log('New Webscoket Connection')

    socket.emit('message',message)
    socket.broadcast.emit('message','A new user has joined!')

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed!')
        }

        io.emit('message',message)
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('message',`https://google.com/maps?q=${coords.lat},${coords.long}`)
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message','User has left the room!')
    })
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})


