WebSocket = require 'ws' 

process.on 'uncaughtException', (err) -> console.log err

WebSocketServer = WebSocket.Server

server = new WebSocketServer {port: 1337}

server.on 'connection', (connection) ->
  console.log 'Incomming connection'
  connection.on 'message', (message) ->
  	console.log 'Recieved: %s', message
  connection.send 'something'

console.log 'Server active'