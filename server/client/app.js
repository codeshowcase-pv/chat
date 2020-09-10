const login_form = $(".login_form");

if(login_form){
    login_form.on('submit', e => {
        e.preventDefault();
      
        $.ajax({
            url: window.location.origin + '/api/login',
            method: 'post',
            data: login_form.serialize(),
            success: res => {
                localStorage.setItem('chat-id', res.id);
                window.location.href = '/chat';
            }
        })
    });
}