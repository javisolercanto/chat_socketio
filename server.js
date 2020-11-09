const express = require('express');
let app = express();
const http = require('http').createServer(app);
let io = require('socket.io')(http);
let gameControler = require('./public/controllers/gameController.js');
let cardGenerator = require('./public/controllers/card.js')


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
        io.in(data.room).emit('chat message', data);
    });
    socket.on('join', data => {
        console.log('joined to general room', data);
        socket.join('general');
        io.sockets.in('general').emit('join', data);
    });
    socket.on('join game', data => {
        console.log('joined to game', data);
        let card = new cardGenerator();
        let game = gameControler.getCurrentGame(data.nickname, card.getMatrix());

        socket.leave(data.room);
        socket.join(game.id);

        console.log(socket);
        io.to(socket.id).emit('card', card.getMatrix());

        io.sockets.in(game.id).emit('joined player', game);
        console.log(JSON.stringify(game));
    });
});

http.listen(666, () => {
    console.log('listening on *:666');
});

