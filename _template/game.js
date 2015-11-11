function frame() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);


  requestAnimationFrame(frame);
}

frame();
