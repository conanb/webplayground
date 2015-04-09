# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

points = []
image = context.createImageData canvas.width, canvas.height

img = new Image
imageData = null

img.onload = ->
	t = document.createElement 'canvas'
	t.width = img.width
	t.height = img.height

	ctx = t.getContext('2d')
	ctx.drawImage img, 0, 0

	imageData = ctx.getImageData( 0, 0, img.width, img.height )
	generate()
	requestAnimationFrame draw
	
img.src = 'smile.png'

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
		x = Math.random()
		y = Math.random()
		ix = Math.floor( img.width * x )
		iy = Math.floor( img.height * y )
		imgIndex = (ix + iy * img.width) * 4
		point = {
			index: n,
			x: canvas.width * x, 
			y: canvas.height * y, 
			r: imageData.data[imgIndex + 0], 
			g: imageData.data[imgIndex + 1], 
			b: imageData.data[imgIndex + 2],
			a: imageData.data[imgIndex + 3]
		}
		points.push point

draw = ->
	start = Date.now()
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
			image.data[index + 3] = point.a
	ms = Date.now() - start
	
	context.putImageData image, 0, 0

	context.font = '18px consolas'
	context.fillStyle = 'black'
	context.fillText "#{ms}ms", 20, 20
	context.fillText "R to regenerate", 20, 40
	requestAnimationFrame draw

# refresh
document.onkeyup = (e) ->
	if e.keyCode is 'R'.charCodeAt(0)
		generate()