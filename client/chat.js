console.log('chat.js file loaded')
var socket = io.connect()

const username = prompt('Welcome, please enter you name')
//event to server with user's name
socket.emit('new-connection', {username})

//capture welcome message event
socket.on('welcome-message', (data) =>{
    console.log('recieved welcome-message >>', data)
    addmessage(data, false)
})
function addmessage(data, isSelf = false){
    const messageElement = document.createElement('div');
    messageElement.classList.add('message')

    if(isSelf){
        messageElement.classList.add('self-message')
        messageElement.innerText = `${data.message}`

    }else{
        if(data.user === 'server'){
            messageElement.innerText = `${data.message}`
        }else{
            messageElement.classList.add('others-message')
            messageElement.innerText = `${data.user}`
        }

    }
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.append(messageElement)
}

const meassageForm = document.getElementById('messageForm')
meassageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const messageInput = document.getElementById('messageInput')

//check if there is a message in the input
    if(messageInput.value !== ''){
        let newMessage = messageInput.value
        socket.emit('new-message', {user: socket.id, message: newMessage})
        addmessage({message: newMessage}, true)

        //reset input
        messageInput.value = ''
    }else{
        messageInput.classList.add('error')
    }
})
socket.on('broadcast-message', (data) => {
    console.log('broadcast-message event >>', data)
    addmessage(data, false)
})