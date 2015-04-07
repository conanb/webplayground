# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

points = []
image = context.createImageData canvas.width, canvas.height

findClosest = (x, y) ->
	closest = {r: 0, g: 0, b: 0}
	closestDist = canvas.width * canvas.height
	for point in points
		dist = (x - point.x) * (x - point.x) + (y - point.y) * (y - point.y)
		if dist < closestDist
			closestDist = dist
			closest = point
	return closest

generate = ->
	# generate random points
	points = []
	for n in [0..512]
		point = {
			index: n,
			count: 0,
			avg: {x: 0, y: 0},
			x: canvas.width * Math.random(), 
			y: canvas.height * Math.random(), 
			r: 255 * Math.random() | 0, 
			g: 255 * Math.random() | 0, 
			b: 255 * Math.random() | 0
		}
		points.push point

smooth = ->
	# setup cells for randomisation
	for point in points
		point.count = 0
		point.avg = {x: 0, y: 0}
	# randomise points and assign to cells
	randomPoints = []
	for [0..4096]
		p = {
			x: canvas.width * Math.random(), 
			y: canvas.height * Math.random()
		}	
		closest = 0
		closestDist = canvas.width * canvas.height
		for point in points
			dist = (p.x - point.x) * (p.x - point.x) + (p.y - point.y) * (p.y - point.y)
			if dist < closestDist
				closestDist = dist
				closest = point.index
		points[closest].count += 1
		points[closest].avg.x += p.x
		points[closest].avg.y += p.y
	# reposition centers
	for point in points
		point.x = point.avg.x / point.count
		point.y = point.avg.y / point.count

draw = ->
	start = Date.now()
	smooth()
	# fill pixels based on closest point
	w = canvas.width - 1
	h = canvas.height - 1
	for x in [0..w]
		for y in [0..h]
			point = findClosest x, y
			index = (x + y * canvas.width) * 4
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
	if e.keyCode is 'S'.charCodeAt(0)
		smooth()

generate()
requestAnimationFrame draw