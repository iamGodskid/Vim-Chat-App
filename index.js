const req = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.port || 3000

const app = req.createServer(requestHandler)
app.listen(port)
    console.log(`server listening at ${port}`);
function requestHandler(request, response){
console.log(`recieved request from ${request.url}`)
var file_path = './client' + request.url
if(file_path == './client/'){
    file_path = './client/index.html'
}

var extname = String(path.extname(file_path)).toLowerCase()
console.log(`serving ${file_path}`)

var mimetypes = {
    '.html': 'text.html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
}

var contentType = mimetypes[extname] || 'application/octet-stream'
fs.readFile(file_path, function(error,content){
    if(error){
        if(error.code == 'ENOENT'){
            fs.readFile('./client/404.html', function(error, content){
                response.writeHead(404, {
                    'Content-Type': contentType
                })
                response.end(content, 'utf-8')
            })
        }else{
            response.writeHead(500)
            response.end(`sorry, there was an error: ` + error.code + '..\n')
        }
    }else{
        response.writeHead(200, {
            'Content-Type': 'contentType'
        })
        response.end(content, 'utf-8')
    }
})

}
//socket.io handling

const io = require('socket.io')(app, {
    path: '/socket.io',
})
io.attach(app, {
    cors: {
        origin: 'http://localhost',
        methods: ['GET', 'POST'],
        credentials: true,
        transports: ['websocket', 'polling'],
    },
    allowE103: true,
})
io.on('connection', (socket) =>{
    console.log(`new socket connected! >>`, socket.id)
})

var users = {}

io.on('connection', (socket) => {
    console.log('new socket connected >>', socket.id)
    socket.on('new-connection', (data) => {
        console.log('new connection event recieved', data)
        users[socket.id] = data.username
        console.log('users : >>', users)
        
        socket.emit('welcome-message', {
            user: 'server',
            message: `Welcome to Vim Chat App ${data.username}. there are ${object.keys(users).length} users connected`,
        })
    })

    socket.on('new-message', (data) => {
        console.log(`new-message from ${data.user}`)
        socket.broadcast.emit('broadcast-message', {
            user: users[data.user],
            message: data.message,
        })
    })
})