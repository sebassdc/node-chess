import Chess = require("node-chess");
import Dir = Chess.Direction;
export = king;

var up = makeMove(0, 1);
var down = makeMove(0, -1);
var left = makeMove(-1, 0);
var right = makeMove(1, 0);
var upLeft = makeMove(-1, 1);
var upRight = makeMove(1, 1);
var downLeft = makeMove(-1, -1);
var downRight = makeMove(1, -1);

var queenSideCastle: Chess.MoveDefinition = {
	canMove: true,
	transforms: { file: -2, rank: 0, absolute: true },
	preCondition: castle({ file: -4, rank: 0 }),
	postMoveAction: postCastle({ file: -2, rank: 0 }, { file: 1, rank: 0 })
}

var kingSideCastle: Chess.MoveDefinition = {
	canMove: true,
	transforms: { file: 2, rank: 0, absolute: true },
	preCondition: castle({ file: 3, rank: 0 }),
	postMoveAction: postCastle({ file: 1, rank: 0 }, { file: -1, rank: 0 })
}

function makeMove(file: number, rank: number): Chess.MoveDefinition {
	return {
		canCapture: true,
		canMove: true,
		transforms: { file, rank }
	}
}

function castle(rookSquare: Chess.Coordinate): Chess.MoveCondition {
	return (piece, state, board) => {
		// King is not allowed to have moved
		var kingMoves = state.moveHistory.filter(moves => moves.piece.id === piece.id);
		if (kingMoves.length > 0) return false;
		
		// If the king isn't at 1,5 or 8,5...
		if ((piece.location.rank !== 1 && piece.location.rank !== 8)
			|| piece.location.file !== 5) return false;

		var coord = piece.getAbsoluteDestination(rookSquare);
		var square = board.getSquare(coord, state);
		
		// Piece must be a rook and the same colour..
		if (square == null) return null;
		if (square.piece == null) return false;
		if (square.piece.name !== "Rook") return false;
		if (square.piece.isWhite !== piece.isWhite) return false;
		
		// Rook must not have moved
		var rookMoves = state.moveHistory.filter(move => move.piece.id === square.piece.id);
		if (rookMoves.length > 0) return false;
		
		// All squares between the King and the Rook must be vacant
		var betweenSquares: Chess.Square[] = [];
		var increment = rookSquare.file > 0 ? 1 : -1;
		for (var x = (1 * increment); x !== rookSquare.file; x += increment) {
			var destination = piece.getAbsoluteDestination({ file: x, rank: 0 });
			betweenSquares.push(board.getSquare(destination, state));
		}

		var allVacant = betweenSquares.every(sq => sq.piece == null);
		return allVacant;

	}
}

function postCastle(rookSquare: Chess.Coordinate, rookDestination: Chess.Coordinate): Chess.MoveFunction {
	return {
		action: (piece, state, board) => {
			var oldRookSquare = board.getSquare(piece.getAbsoluteDestination(rookSquare), state);

			var newRookSquare = board.getSquare(piece.getAbsoluteDestination(rookDestination), state);

			newRookSquare.piece = oldRookSquare.piece;
			oldRookSquare.piece = null;
		}
	}
}

function oppositeDirection(dir: Dir): Dir {
	return dir === Dir.QueenSide
		? Dir.KingSide
		: Dir.QueenSide;
}

var king: Chess.Piece = {
	notation: "k",
	name: "King",
	movement: [upLeft, upRight, downLeft, downRight, up, down, left, right, queenSideCastle, kingSideCastle],
	canQueen: false,
	canSpawn: false,
	value: 10
}