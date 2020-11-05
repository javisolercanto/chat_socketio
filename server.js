const express = require('express');
let app = express();
const http = require('http').createServer(app);
let io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connect', (socket) => {
    socket.on('hello', data => {
        console.log(data);
    });
    socket.on('newMessage', data => {
        console.log('msg', data);
        io.to(data.room.name).emit('chat message', data);
    });
    socket.on('join', data => {
        console.log('join', data);
        socket.join(data.room.name);
        io.to(data.room.name).emit('joined player', data);
        
        /* socket.emit('chat message', data) */

        /**
         {id: xxx, players: [], counter: zzz}
         */

        /* socket.to().emit(); */
    });
});

http.listen(666, () => {
    console.log('listening on *:666');
});

