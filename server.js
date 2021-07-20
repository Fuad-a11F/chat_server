const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('running')
})

let storeBd = {}

app.use(express.json())

app.use(cors())

io.on('connection', (socket) => {
    socket.on('joined', data => {
        if (!(data.room in  storeBd)) {
            storeBd[data.room] = {
                users: [],
                message: []
            }
        }

        socket.join(data.room)
        
        storeBd[data.room].users.push(data)
        
        io.to(data.room).emit('getUsers', storeBd[data.room].users)
        
        socket.on('disconnect', ()  => {
            let index = 0
            storeBd[data.room].users.forEach((item, i) => {
                if (item.value === data.value) {
                    index = i
                }
            })
            storeBd[data.room].message = storeBd[data.room].message.filter(item => item.name != storeBd[data.room].users[index].value)        
            storeBd[data.room].users = storeBd[data.room].users.filter(item => item.value != storeBd[data.room].users[index].value)        
            io.to(data.room).emit('getUsers', storeBd[data.room].users)
        })

        socket.on('message', ({ name, text, room, img, voice }) => {
            let sms = {name, text, img, voice}
            storeBd[room].message.push(sms)
            io.to(room).emit('getMessage', storeBd[room].message)
        })
    })
})

let port = process.env.PORT || 3001

server.listen(port,  () => {
    console.log(`server is working on ${port} port`)
})




