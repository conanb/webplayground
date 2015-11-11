var cellSize = 8;
var cellCount = {x: width / cellSize, y: height / cellSize};
var centerCell = {x: cellCount.x / 2, y: cellCount.y / 2};
var roomSize = {min: 3, max: 12};
var roomCount = 150;
var roomMeanSize = {w: 0, h:0};
var rooms = new Array(roomCount);
var spawnRadius = {w: 0.75, h: 0.25};

var i, j, count;

var Gauss = gaussian(0.0,0.2);

var touching = false;

var keyRoomThreshold = 1.25;
var keyRooms = [];
var keyRoomGraph;

var seed = 666 * Math.random();
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function randRange(l, h) {
	return Math.max(0,Math.min(1,Gauss.pdf(random() * 10 - 5))) * (h - l) + l;
}

function getRandomPointInElipse(width_radius, height_radius) {
	var t = 2 * Math.PI * random();
	var u = random() + random();
	var r = 0;
	if (u > 1)
		r = 2 - u;
	else
		r = u;
	return {
		x: width_radius * r * Math.cos(t),
		y: height_radius * r * Math.sin(t)
	};
}

function genRoom(id) {
	var room = {id: id};

	var p = getRandomPointInElipse( cellCount.x / 2 * spawnRadius.w, cellCount.y / 2 * spawnRadius.h );
	room.x = p.x + centerCell.x;
	room.y = p.y + centerCell.y;

	room.width = room.height = Math.floor(randRange(roomSize.min, roomSize.max));
	room.height = Math.floor(randRange(Math.max(roomSize.min, room.width - 3), Math.min(roomSize.max,room.width + 5)));

	room.v = {x:0, y:0};

	roomMeanSize.w += room.width;
	roomMeanSize.h += room.height;

	return room;
}

// generate rooms
for (i = 0 ; i < roomCount ; ++i)
	rooms[i] = genRoom(i);

roomMeanSize.w /= roomCount;
roomMeanSize.h /= roomCount;

for (i = 0 ; i < roomCount ; ++i)
	if (rooms[i].width > (keyRoomThreshold * roomMeanSize.w) &&
		rooms[i].height > (keyRoomThreshold * roomMeanSize.h))
		rooms[i].type = 1;
	else
		rooms[i].type = 0;

function overlapped(r0, r1) {
	var minX0 = r0.x - r0.width * 0.5;
	var maxX0 = r0.x + r0.width * 0.5;
	var minY0 = r0.y - r0.height * 0.5;
	var maxY0 = r0.y + r0.height * 0.5;
	var minX1 = r1.x - r1.width * 0.5;
	var maxX1 = r1.x + r1.width * 0.5;
	var minY1 = r1.y - r1.height * 0.5;
	var maxY1 = r1.y + r1.height * 0.5;

	if (minX0 > maxX1) return false;
	if (minY0 > maxY1) return false;
	if (minX1 > maxX0) return false;
	if (minY1 > maxY0) return false;
	return true;
}

function seperateRooms(dt) {
	touch = false;
	// for each room calculate a force to push it away from other rooms
	for (i = 0 ; i < roomCount ; ++i) {

		rooms[i].v = {x:0, y:0};
		neighbours = 0.0;

		for (j = 0 ; j < roomCount ; ++j) {
			if (i == j) continue;

			if (overlapped(rooms[i], rooms[j]) == true) {
				neighbours += 1.0;
				touch = true;
				rooms[i].v.x += rooms[i].x - rooms[j].x;
				rooms[i].v.y += rooms[i].y - rooms[j].y;
			}
		}

		if (neighbours > 0) {
			rooms[i].v.x /= neighbours;
			rooms[i].v.y /= neighbours;

			var f = Math.sqrt(rooms[i].v.x * rooms[i].v.x + rooms[i].v.y * rooms[i].v.y);
			rooms[i].v.x /= f;
			rooms[i].v.y /= f;
		}
	}
	for (i = 0 ; i < roomCount ; ++i) {
		rooms[i].x = rooms[i].x + rooms[i].v.x * dt;
		rooms[i].y = rooms[i].y + rooms[i].v.y * dt;

		// keep within bounds?
		if ((rooms[i].x - rooms[i].width * 0.5) < 0)
			rooms[i].x = rooms[i].width * 0.5;
		if ((rooms[i].y - rooms[i].height * 0.5) < 0)
			rooms[i].y = rooms[i].height * 0.5;
		if ((rooms[i].x + rooms[i].width * 0.5) > cellCount.x)
			rooms[i].x = cellCount.x - rooms[i].width * 0.5;
		if ((rooms[i].y + rooms[i].height * 0.5) > cellCount.y)
			rooms[i].y = cellCount.y - rooms[i].height * 0.5;
	}
	return touch;
}

function generateGraph() {

	var index = 0;
	for ( i = 0 ; i < roomCount ; ++i) {
		if (rooms[i].type == 1)
			keyRooms.push( [rooms[i].x, rooms[i].y] );
	}

	keyRoomGraph = Delaunay.triangulate(keyRooms);
}

function drawGraph() {
	ctx.strokeStyle = 'red';
	for(i = keyRoomGraph.length; i; ) {
        ctx.beginPath();
        --i; ctx.moveTo(keyRooms[keyRoomGraph[i]][0] * cellSize, keyRooms[keyRoomGraph[i]][1] * cellSize);
        --i; ctx.lineTo(keyRooms[keyRoomGraph[i]][0] * cellSize, keyRooms[keyRoomGraph[i]][1] * cellSize);
        --i; ctx.lineTo(keyRooms[keyRoomGraph[i]][0] * cellSize, keyRooms[keyRoomGraph[i]][1] * cellSize);
        ctx.closePath();
        ctx.stroke();
      }
}

/*
// drawing code below here
*/
function drawRooms() {
	ctx.fillStyle = 'black';
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 3;

	for ( i = 0 ; i < roomCount ; ++i) {

		if (rooms[i].type == 1)
			ctx.fillStyle = "green";
		else
			ctx.fillStyle = "black";
	
		ctx.fillRect( 
			Math.floor(rooms[i].x - rooms[i].width * 0.5) * cellSize, 
			Math.floor(rooms[i].y - rooms[i].height * 0.5) * cellSize, 
			rooms[i].width * cellSize, 
			rooms[i].height * cellSize );

		// draw edge
	/*	ctx.moveTo((rooms[i].x - rooms[i].width) * cellSize, (rooms[i].y - rooms[i].height) * cellSize);
		ctx.lineTo((rooms[i].x + rooms[i].width) * cellSize, (rooms[i].y - rooms[i].height) * cellSize);
		ctx.lineTo((rooms[i].x + rooms[i].width) * cellSize, (rooms[i].y + rooms[i].height) * cellSize);
		ctx.lineTo((rooms[i].x - rooms[i].width) * cellSize, (rooms[i].y + rooms[i].height) * cellSize);
		ctx.lineTo((rooms[i].x - rooms[i].width) * cellSize, (rooms[i].y - rooms[i].height) * cellSize);

		ctx.stroke();*/
	}
}

function drawGrid() {
	ctx.strokeStyle = '#ddd';
	ctx.lineWidth = 1;
	for (var x = 0 ; x <= width ; x += cellSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
 		 ctx.closePath();
	}
	for (var y = 0 ; y <= height ; y += cellSize) {
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
  		ctx.closePath();
	}
	ctx.stroke();
}

function frame() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, height);

	touching = seperateRooms(0.1);
	drawRooms();

	// this causes major slowdown
	//drawGrid();

	if (touching)
		requestAnimationFrame(frame);
	else {
		generateGraph();
		drawGrid();
		drawGraph();
	}
}

frame();