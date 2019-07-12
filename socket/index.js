module.exports = async function (io) {
    let allUsers = []

    await io.on('connection', (socket)=>{
        socket.on('chat message', (data)=>{
          io.emit('chat message', data)
        })

        socket.on('chat join', (user)=>{
          io.emit('chat join', user)
        })

        socket.on('chat user', (user)=>{
          socket.username = user;
          if(allUsers.indexOf(socket.username)>-1){

          }else{
            allUsers.push(socket.username)
          }
          io.emit('chat user', allUsers)
        })
      
        socket.on('disconnect', (data)=>{
          if(allUsers.indexOf(socket.username)>-1){
            allUsers.splice(allUsers.indexOf(socket.username), 1)
          }
          io.emit('chat user', allUsers)
          io.emit('chat left', socket.username)
          console.log('User disconnected!')
        })
      })
}