const express = require('express');
const app = express();
const handlebars  = require('express-handlebars');
const body_parser = require('body-parser');
const uuid = require('uuid');

const http = require('http').createServer(app);
const socket_io = require('socket.io')(http);

app.use(express.static(__dirname + '\\client'));
app.use(body_parser.urlencoded({extended: true}));

const path = {
    views: __dirname + '\\client\\views\\'
}

app.engine('hbs', handlebars({
    layoutsDir: __dirname + "/client/views/layouts",
    defaultLayout: "app",
    extname: 'hbs'
}));

//data
class User {
    constructor(_name){
        this.name = _name;
    }
}

var users = {};
var messages = [];


//views

app.get('/', (req, res) => {
    res.render(path.views + 'login.hbs');
});

app.get('/chat', (req, res) => {
    res.render(path.views + 'chat.hbs');
});


//api

app.post('/api/login', (req, res) => {
    let id = uuid.v4();
    users[id] = new User(req.body.name);
    res.send({id});
});

//web socket

socket_io.on('connection', socket => {
    socket.on('init_user', msg => {
        if(!users[msg.id]){
            socket.emit('init_user', {result: false, text: 'Нет такого пользователя'});
        }
        else{
            socket.emit('init_user', {result: true, messages});
        }
    });

    socket.on('user_message', msg => {
        messages.push({
            sender_id: msg.id,
            sender_name: users[msg.id].name,
            text: msg.text
        });

        socket_io.emit('chat_messages', {messages});
    })
});

http.listen(3000, '0.0.0.0');