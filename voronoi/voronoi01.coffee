# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

points = []
image = context.createImageData 512, 512

findClosest = (x, y) ->
	closest = {r: 0, g: 0, b: 0}
	closestDist = 512 * 512
	for point in points
		dist = (x - point.x) * (x - point.x) + (y - point.y) * (y - point.y)
		if dist < closestDist
			closestDist = dist
			closest = point
	return closest

generate = ->
	# generate random points
	points = []
	for n in [0..64]
		point = {
			x: 512 * Math.random(), 
			y: 512 * Math.random(), 
			r: 255 * Math.random() | 0, 
			g: 255 * Math.random() | 0, 
			b: 255 * Math.random() | 0
		}
		points.push point

draw = ->
	start = Date.now()
	# fill pixels based on closest point
	for x in [0..511]
		for y in [0..511]
			point = findClosest x, y
			index = (x + y * 512) * 4
			image.data[index + 0] = point.r
			image.data[index + 1] = point.g
			image.data[index + 2] = point.b
			image.data[index + 3] = 255
	ms = Date.now() - start

	context.putImageData image, 0, 0
	context.font = '18px consolas'
	context.fillStyle = 'white'
	context.fillText "#{ms}ms", 20, 20
	context.fillText "R to regenerate", 20, 40
	requestAnimationFrame draw

# refresh
document.onkeyup = (e) ->
	if e.keyCode is 'R'.charCodeAt(0)
		generate()

generate()
requestAnimationFrame draw