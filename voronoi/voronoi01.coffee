# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

points = []
image = context.createImageData 512, 512

fps = 0
frameCount = 0
lastFrameTime = 0

findClosest = (x, y) ->
	closest = {r: 0, g: 0, b: 0}
	closestDist = 512 * 512
	for point in points
		dist = (x - point.x) * (x - point.x) + (y - point.y) * (y - point.y)
		if dist < closestDist
			closestDist = dist
			closest = point
	return closest

setup = ->
	console.log 'Setup'
	# generate random points
	points = []
	for n in [0..32]
		point = {x: 512 * Math.random(), y: 512 * Math.random(), r: 255 * Math.random() | 0, g: 255 * Math.random() | 0, b: 255 * Math.random() | 0}
		points.push point

	# fill pixels based on closest point
	for x in [0..511]
		for y in [0..511]
			point = findClosest x, y
			index = (x + y * 512) * 4
			image.data[index + 0] = point.r
			image.data[index + 1] = point.g
			image.data[index + 2] = point.b
			image.data[index + 3] = 255

draw = ->
	# calculate fps
	now = Math.floor(Date.now()/1000)
	if now != lastFrameTime
		fps = frameCount
		frameCount = 0
		lastFrameTime = now
	frameCount++

	context.putImageData image, 0, 0
	context.font = '18px consolas'
	context.fillStyle = 'black'
	context.textAlign = 'right'
	context.fillText "fps: #{fps}", 500, 20

# main loop at 60fps
run = ->
	setTimeout run, 16
	requestAnimationFrame draw

# refresh
document.onkeyup = (e) ->
	if e.keyCode is 'R'.charCodeAt(0)
		setup()

setup()
run()