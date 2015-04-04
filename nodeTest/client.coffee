# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
ctx = canvas.getContext '2d'
canvas.oncontextmenu = -> false

# open connection
socket = new WebSocket 'ws://127.0.0.1:1337'

socket.onerror = (e) -> console.log e

socket.onmessage = (message) ->
	console.log 'We got one!: %s', message
	socket.send 'Thanks'

# game logic
update = ->

# render code
draw = ->
	ctx.fillStyle = 'black'
	ctx.fillRect 0, 0, canvas.width, canvas.height
	ctx.font = '17px sans-serif'
	ctx.fillStyle = 'white'
	ctx.textAlign = 'right'
	ctx.fillText "client test", 800, 20

# main game loop at 60fps
run = ->
	setTimeout run, 16
	update()
	requestAnimationFrame draw

# socket.onopen = ->
	run()