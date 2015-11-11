

function frame() {
	var m = document.getElementById("mean").value;
var sd = document.getElementById("deviation").value;
	if (sd <= 0)
		sd = 1;
	var Gauss = gaussian(m,sd);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  // draw grid lines
  ctx.moveTo(0, height - height / 4);
  ctx.lineTo(width, height - height / 4);
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  // draw markers
  ctx.moveTo(width / 2 - 20, height / 4);
  ctx.lineTo(width / 2 + 20, height / 4);
  ctx.moveTo(width / 2 - 100, height - height / 4 - 20);
  ctx.lineTo(width / 2 - 100, height - height / 4 + 20);
  ctx.moveTo(width / 2 - 200, height - height / 4 - 20);
  ctx.lineTo(width / 2 - 200, height - height / 4 + 20);
  ctx.moveTo(width / 2 - 300, height - height / 4 - 20);
  ctx.lineTo(width / 2 - 300, height - height / 4 + 20);
  ctx.moveTo(width / 2 - 400, height - height / 4 - 20);
  ctx.lineTo(width / 2 - 400, height - height / 4 + 20);
  ctx.moveTo(width / 2 - 500, height - height / 4 - 20);
  ctx.lineTo(width / 2 - 500, height - height / 4 + 20);
  ctx.moveTo(width / 2 + 100, height - height / 4 - 20);
  ctx.lineTo(width / 2 + 100, height - height / 4 + 20);
  ctx.moveTo(width / 2 + 200, height - height / 4 - 20);
  ctx.lineTo(width / 2 + 200, height - height / 4 + 20);
  ctx.moveTo(width / 2 + 300, height - height / 4 - 20);
  ctx.lineTo(width / 2 + 300, height - height / 4 + 20);
  ctx.moveTo(width / 2 + 400, height - height / 4 - 20);
  ctx.lineTo(width / 2 + 400, height - height / 4 + 20);
  ctx.moveTo(width / 2 + 500, height - height / 4 - 20);
  ctx.lineTo(width / 2 + 500, height - height / 4 + 20);
  ctx.stroke();


	ctx.beginPath();
  // draw graph
  ctx.strokeStyle = 'red';

  var start = true;
  for (var i = -5 ; i <= 5 ; i += 0.1) {

  	var y = Gauss.pdf(i);

  	if (start) {
 		ctx.moveTo(width / 2 + (i * 100), height - height / 4 - (y * height / 2));
 		start = false;
  	}
	else
  		ctx.lineTo(width / 2 + (i * 100), height - height / 4 - (y * height / 2));
  }
  ctx.stroke();

  requestAnimationFrame(frame);
}

frame();
