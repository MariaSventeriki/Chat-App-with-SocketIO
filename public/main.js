const socket = io();

const clickHandler = () => {
    let msg = document.querySelector('#msg-box');
    socket.emit('chat message', msg.value);
    msg.value = '';
}

socket.emit('token', sessionStorage.getItem('token'));

socket.on('ticket', ticket => {
    document
    .querySelector('#chat-box')
    .insertAdjacentHTML("beforeend", `<li>Welcome on board ${ticket.nickName}</li>`);
    sessionStorage.setItem('token', ticket.token);
});

socket.on('chat msg', msg => {
    document.querySelector('#chat-box').insertAdjacentHTML("beforeend", `<li>${msg}</li>`);
});