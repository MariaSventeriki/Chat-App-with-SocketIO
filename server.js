const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {

    //When a user connects, we create a new uniq nick name 
    //and emmit
    socket.on('token', token => {
        const ticketHandler = (nickName) => {
            if (!nickName) {
                nickName = 'Guest' + Date.now();
            } 
            const token = jwt.sign({nickName}, 'ahguy21367278@#$%$%@wer', {expiresIn: '1w'});
            const ticket = {token, nickName};
            console.log(nickName + ' is joind to the chat');
            return ticket
        }

        if (token) {
            try {
                jwt.verify(token, 'ahguy21367278@#$%$%@wer', (fail, decodedPayload) => {
                    if (fail) {
                        //token is invalid here
                        socket.emit('ticket', ticketHandler());
                    } else {
                        //we can trust decoded payload here
                        socket.emit('ticket', ticketHandler(decodedPayload.nickName));
                    }
                });
            } catch (err) {
                console.log(err);
                //TODO: Manage error case on server and client
            }
        } else {
            socket.emit('ticket', ticketHandler());
        }
    });
    


    socket.on('chat message', (message) => {
        console.log(message);
        io.emit('chat msg', message);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));