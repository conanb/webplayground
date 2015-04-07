# canvas setup
canvas = document.getElementsByTagName('canvas')[0]
context = canvas.getContext '2d'

image = context.createImageData canvas.width, canvas.height
pixels = image.data

offset = 0
ms = 0

p3 = (x, y, z, o, p) ->
	total = 0
	n = o - 1
	for i in [0..n]
		frequency = Math.pow( 2.0, i )
		amplitude = Math.pow( p, i )
		total = total + perlin3(x * frequency, y * frequency, z * frequency) * amplitude
	return total
      

# generate and time some noise
generate = ->
	start = Date.now()
	offset += 0.15
	w = canvas.width - 1
	h = canvas.height - 1
	for x in [0..w]
		for y in [0..h]
			n = .5 * ( perlin3 x / 16, y / 256, offset ) + .5
			n = 255 * n
			index = (x + y * canvas.width) * 4
			pixels[index + 0] = n
			pixels[index + 1] = pixels[index + 2] = 0
			pixels[index + 3] = 255
	ms = Date.now() - start

draw = ->
	generate()
	context.putImageData image, 0, 0
	context.font = '18px consolas'
	context.fillStyle = 'white'
	context.fillText "#{ms}ms", 20, 20
	requestAnimationFrame draw

requestAnimationFrame draw