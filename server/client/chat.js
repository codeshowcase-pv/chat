const socket = io();
const form_message = $('.form-message');

const get_user_id = () => {
    return localStorage.getItem('chat-id');
};

const pretty_messages = (messages = []) => {
    return messages.map(message => {
        return {sender_name: message.sender_name, text: message.text};
    })
};

const display_messages = (messages = []) => {
    let messages_box = $('.messages');

    messages_box.empty();

    messages.map(message => {
        messages_box.append(`<p class="messages_item"><span class="font-bold text-lg text-yellow-400">${message.sender_name}:</span> ${message.text}</p>`)
    });
};



socket.emit('init_user', {id: get_user_id()});

display_messages();

socket.on('init_user', msg => {
    if(!msg.result) {
        alert(msg.text);
        window.location.href = '/';
    }

    display_messages(pretty_messages(msg.messages));
});

socket.on('chat_messages', msg => {
    display_messages(pretty_messages(msg.messages));
});

if(form_message){
    form_message.on('submit', e => {
        e.preventDefault();
        socket.emit('user_message', {
            text: form_message.find("[name=message]").val(), 
            id: get_user_id()
        });

        form_message.find("[name=message]").val('');
    })
}