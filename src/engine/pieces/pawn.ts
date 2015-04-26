import types = require("../../types");
import BaseFactory = require("../baseFactory");
export = PawnFactory;
/**
 * Pawn piece registration
 */

class PawnFactory extends BaseFactory {
	constructor() {
		var piece = {
			name: "Pawn",
			movement: [moveForward, moveCapture],
			canQueen: true,
			canSpawn: false,
			value: 1,
			notation: "p"
		}
		super(piece);
	}
}

var moveForward = {
	moves: [{ direction: types.Direction.Up, count: 1 }],
	canJump: false,
	canCapture: false,
	canMove: true
}

var moveCapture = {
	moves: [{ direction: types.Direction.DiagonalUp, count: 1 }],
	canJump: false,
	canCapture: true,
	canMove: false
}

var forward: Chess.SingleMove = {
	direction: types.Direction.Up,
	count: 1
}
