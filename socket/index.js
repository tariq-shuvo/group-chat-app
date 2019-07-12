module.exports = async function (io) {
    let allUsers = []

    // Connection initialization
    await io.on('connection', (socket)=>{
        // Send Messages Data to Users
        socket.on('chat message', (data)=>{
          io.emit('chat message', data)
        })

        // User joined notifications
        socket.on('chat join', (user)=>{
          if(allUsers.length>1){
            io.emit('chat join', user)
          }
        })

        // Get User Name As Auth
        socket.on('chat user', (user)=>{
          socket.username = user;
          if(allUsers.indexOf(socket.username)>-1){
            io.emit('used user', {name:socket.username, used:true})
          }else{
            allUsers.push(socket.username)
            io.emit('used user', {name:socket.username, used:false})
          }
          // Send User List
          io.emit('chat user', allUsers)
        })

        // User Typing Sense
        socket.on('typing', (data)=>{
          socket.broadcast.emit('typing', {user: socket.username})
        })

        // Stop Typing Sense
        socket.on('stop typing', (data)=>{
          io.emit('stop typing', {user: socket.username})
        })

        // User Disconnect From Chat Notification
        socket.on('disconnect', (data)=>{
          if(allUsers.indexOf(socket.username)>-1){
            allUsers.splice(allUsers.indexOf(socket.username), 1)
          }
          // Update Online User List
          io.emit('chat user', allUsers)
          // User Disconnect Notification
          if(allUsers.length>0){
            io.emit('chat left', socket.username)
          }
          console.log('User disconnected!')
        })
      })
}