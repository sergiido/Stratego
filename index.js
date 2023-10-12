const express = require('express');
const app = express();
app.set("view engine", "hbs");

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
	res.render("index.hbs");
});

io.on('connection', (socket) => {
	console.log(socket.id);

	socket.emit('initGame', playBoard.getState());

	socket.on('getState', () => {
		socket.emit('setState', playBoard.getState());
	});
	
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

});




server.listen(3000, () => {
	console.log('listening on *:3000');
});


const Colors = {
	red: 'OrangeRed',
	blue: 'MediumTurquoise',
	terrain: '#229954',
	terrain_highlight: '#3bb16d'
};

const cellWidth = 50;

const boardState = [];
for (let row = 0; row < 10; row++) {
	const boardStateRow = [];
  	for (let col = 0; col < 10; col++) {
	  	boardStateRow.push({
			x: col * cellWidth, 
			y: row * cellWidth,
			figure: null
	  	});
	}
	boardState.push(boardStateRow);
}

class Board {
	constructor() {
		this.figures = Figures;
		this.boardState = boardState;
		this.clickedCoords = null;
	}

	getState() {
		return this.boardState;
	}

	setFigure(row, col, figure) {
		this.getState()[row][col].figure = figure;
	}	
}


class Terrain {
	constructor(name) {
		this.name = name.name;
		this.label = name.label;
		this.color = name.color;
	}
}

class Water extends Terrain {}

const Figures = {
	bomb: {
		name: 'Bomb',
		label: '💣',
		rate: 100,
		color: null
	},
	flag: {
		name: 'Flag',
		label: '🚩',
		rate: 0,
		color: 'orange',
		isFigure: true,
		canMove: false
	},
	spy: {
		name: 'Spy',
		label: '1',
		rate: 1,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	scout: {
		name: 'Scout',
		label: '2',
		rate: 2,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 10
	},
	miner: {
		name: 'Miner',
		label: '3',
		rate: 3,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	sergeant: {
		name: 'Sergeant',
		label: '4',
		rate: 4,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	lieutenant: {
		name: 'Lieutenant',
		label: '5',
		rate: 5,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	captain: {
		name: 'Captain',
		label: '6',
		rate: 6,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	major: {
		name: 'Major',
		label: '7',
		rate: 7,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	colonel: {
		name: 'Colonel',
		label: '8',
		rate: 8,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	general: {
		name: 'General',
		label: '9',
		rate: 9,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	marshall: {
		name: 'Marshall',
		label: '10',
		rate: 10,
		color: null,
		isFigure: true,
		canMove: true,
		steps: 1
	},
	ground: {
		name: 'Ground',
		label: '',
		rate: 0,
		color: Colors.terrain,
		isFigure: false,
		canMove: false
	},
	water: {
		name: 'Water',
		label: '',
		rate: 0,
		color: '#3498DB',
		isFigure: false,
		canMove: false
	}
};

class Figure {
	constructor(figure, color, hidden) {
		this.name = figure.name;
		this.label = figure.label;
		this.rate = figure.rate;
		this.color = color;
		this.isFigure = figure.isFigure;
		this.canMove = figure.canMove;
		this.steps = figure.steps;
		this.image = figure.image;
		this.hidden = hidden || false;
	}
}

const playBoard = new Board();

// add water
let water = new Water(Figures.water);
playBoard.setFigure(4, 2, water);
playBoard.setFigure(4, 3, water);
playBoard.setFigure(5, 2, water);
playBoard.setFigure(5, 3, water);
playBoard.setFigure(4, 6, water);
playBoard.setFigure(4, 7, water);
playBoard.setFigure(5, 6, water);
playBoard.setFigure(5, 7, water);

// add blue team
const blueFlag = new Figure(Figures.flag, Colors.blue, true);
playBoard.setFigure(0, 3, blueFlag);
let blueSpy = new Figure(Figures.spy, Colors.blue, true);
playBoard.setFigure(2, 3, blueSpy);
let blueScout = new Figure(Figures.scout, Colors.blue, true);
playBoard.setFigure(2, 2, blueScout);
const blueMiner = new Figure(Figures.miner, Colors.blue, true);
playBoard.setFigure(2 , 6, blueMiner);
const blueMarshall = new Figure(Figures.marshall, Colors.blue, true);
playBoard.setFigure(3, 7, blueMarshall);
let blueBomb = new Figure(Figures.bomb, Colors.blue, true);
playBoard.setFigure(3, 5, blueBomb);

// add red team
const redFlag = new Figure(Figures.flag, Colors.red);
playBoard.setFigure(9, 6, redFlag);
const redSpy = new Figure(Figures.spy, Colors.red);
playBoard.setFigure(6, 3, redSpy);
const redMiner = new Figure(Figures.miner, Colors.red);
playBoard.setFigure(6, 5, redMiner);
let redScout = new Figure(Figures.scout, Colors.red);
playBoard.setFigure(7, 4, redScout);
const redMarshall = new Figure(Figures.marshall, Colors.red);
playBoard.setFigure(6, 7, redMarshall);