const socket = io();
const $ = selector => document.querySelector(selector);
const listEnumerable = ['channels', 'users']
const state = {
    list: 0,
    users:[],
    channels:[],
    activeChannel: 'JS',
    activeUser: null
};
const switchHandler = () => {
    //alert(state.list);
    switch (state.list) {
        case 0:
            state.list = 1;
            listManager();
            break;
            
        case 1:
            state.list = 0;
            listManager();
                break;
    
        default:
            alert(`There's problem please try again later`)
            break;
    }
}

const listClickHandler = (name) => {
    //alert(name);
    state.activeChannel = name;
    $(`#${name}`).classList.add('active');
}

const listManager = () => {
    $('#active-list').innerHTML = '';
    state[listEnumerable[state.list]].forEach(item => {
        $('#active-list').insertAdjacentHTML('beforeend', `<li id = "${item}" onclick = "listClickHandler('${item}')" class = "list-item">${item}</li>`)
    });
}

socket.on('chat msg', envelope => {
    if (state.activeChannel == envelope.channel) {
        document.querySelector('#chat-box').insertAdjacentHTML("beforeend", `<li>${envelope.msg}</li>`);
    }
});

socket.on('users', users => {
    state.users = users;
    listManager();
});

socket.on('channels', channels => {
    state.channels = channels;
    listManager();
});

const clickHandler = () => {
    let msg = $('#msg-box');
    socket.emit('chat message', {msg:msg.value, channel:state.activeChannel, user: state.activeUser});
    msg.value = '';
}

socket.emit('token', sessionStorage.getItem('token'));

socket.on('ticket', ticket => {
    document
    .querySelector('#chat-box')
    .insertAdjacentHTML("beforeend", `<li>Welcome on board ${ticket.nickName}</li>`);
    sessionStorage.setItem('token', ticket.token);
});