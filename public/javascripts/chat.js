$(document).ready(function(){
    var socket = io();
    var allMessages = $("#chat_messages") 

    //Submit User Name
    $("#nameInputForm").submit(function(e){
        e.preventDefault();
        var enterName = $("#enterName").val();

        if(enterName !== null)
        {
            socket.emit('chat join', enterName);
            socket.emit('chat user', enterName);
        }
    })

    //Get Used Username From Socket
    socket.on('used user', (user)=>{
        if(user.used===true)
        {
            $("#error_msg").html('<p style="color:red;">'+user.name+' already exsist into the chat box. Try another one.</p>')
        }else{
            if(user.name===$("#enterName").val()){
                $("#nameContainer").hide();
                $("#messageContainer").show();
            }
        }
    });

    //Get Joined User From Socket
    socket.on('chat join', (user)=>{
        if(user!==$("#enterName").val())
        {
            $("#chat_messages").append('<p>'+user+' joined in chat</p>')
        }
    });

    //Get Left User From Socket
    socket.on('chat left', (user)=>{
        $("#chat_messages").append('<p>'+user+' left from chat</p>')
    });

    //Get User List From Socket
    socket.on('chat user', (users)=>{
      $("#active_users").html("")  
      if(users.length>1)
      {
          for(x in users){
                if(users[x]!==$("#enterName").val()){
                    $("#active_users").append("<div>"+users[x]+"</div>")
                }
            }
      }else{
          $("#active_users").html("<div>No one active</div>")
      }
      
    })

    //Sumbit Chat Message
    $("#message").submit(function(e){
        e.preventDefault();

        var data = {
            user: $("#enterName").val(),
            msg: $("#user_msg").val()
            };
        //Call Chat Socket    
        socket.emit('chat message', data);
        //Call Stop Typing Socket
        socket.emit('stop typing')
        $("#user_msg").val('');
        return false;
        
    })

    //Emit Typing
    $('#user_msg').bind("keypress", () => {
        socket.emit('typing')
    })

    //Emit Stop Typing Socket
    $('#user_msg').focusout(() => {
        socket.emit('stop typing')
    })

    //Get Typing Socket
    socket.on('typing', (data)=>{
        if(data.user!==$("#enterName").val()){
            $("#is_typing").html('<p>typing...</p>')
        }
    })

    //Get Stop Typing Socket
    socket.on('stop typing', (data)=>{
        if(data.user!==$("#enterName").val()){
            $("#is_typing").html('')
        }
    })

    //Get Message From Socket
    socket.on('chat message', (data)=>{  
      if(data.user===$("#enterName").val()){
          $("#chat_messages").append('<div class="self">'+'<b>'+data.user+'</b>: '+data.msg+'</div>')
      }else{
          $("#chat_messages").append('<div>'+'<b>'+data.user+'</b>: '+data.msg+'</div>')
      }  
    })
})