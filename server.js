const { resolve6 } = require('dns');
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const cors = require('cors');
const { RSA_NO_PADDING } = require('constants');

let storeBd = {first: {
    users: [],
    message: []
}}

app.get('/', (req, res) => {
    res.send('running')
})

app.get('/room', (req, res) => {
    res.json(storeBd.first.users)
}) 

app.use(express.json())
app.use(cors())

app.post('/room', (req, res) => {
    res.send()
})

io.on('connection', (socket) => {
    console.log('connect')
    socket.on('joined', data => {
        socket.join('first')
        storeBd['first'].users.push(data)
        socket.on('disconnect', ()  => {
            storeBd.first.users.splice(storeBd.first.users.indexOf(data), 1)
            storeBd.first.message.splice(0, storeBd.first.message.length)

        })
        socket.on('message', ({ value, value11}) => {
            let sms = {name: value, text: value11}
            storeBd.first.message.push(sms)
            io.emit('getMessage', storeBd.first.message)
        })
    })
})

server.listen(3001,  () => {
    console.log('DAAA')
})




