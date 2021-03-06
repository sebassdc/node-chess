import Engine from '../index';
import {
	BoardState,
	Square,
	Move,
	MoveFunction,
} from '../../types';
import deepCopy from './deepCopy';

export default function movePiece(this: Engine, move: Move, boardState?: BoardState): BoardState {
	var from = move.from;
	var to = move.to;
	
	// TODO: Replace with better method
	// If no boardState is provided, the result of this function is stored as the calling engine's new board state 
	var saveToBoard = !boardState;
	boardState = deepCopy(boardState || this.boardState);

	var origin: Square = this.getSquare(from, boardState);
	if (!origin || !origin.piece) return null;			
	
	// Enforce turn-based movement
	if (boardState.whitesTurn !== origin.piece.isWhite) return null; 
		
	// The 'destination' square must be in the square's list of available moves
	var pieceMove = boardState.moves.filter(m =>
		m.from.file === from.file && m.from.rank === from.rank &&
		m.to.file === to.file && m.to.rank === to.rank)[0];
	if (!pieceMove) return null;

	var destination: Square = this.getSquare(to, boardState);
	if (destination.piece) boardState.capturedPieces.push(destination.piece)

	destination.piece = origin.piece;
	destination.piece.location = { file: to.file, rank: to.rank };
	boardState.moveHistory.push({ from: from, to: to, piece: destination.piece });

	var movePatternPostActions = pieceMove.postMoveActions || [];
	movePatternPostActions.forEach(func => {
		func.action(destination.piece, boardState, this);
	});

	var pieceFunctions = destination.piece.postMoveFunctions || [];
	pieceFunctions.forEach(fn => fn.action(destination.piece, boardState, this));

	origin.piece = null;

	boardState.whitesTurn = !boardState.whitesTurn;

	this.populateAvailableMoves(boardState);

	var enginePostMoveActions: MoveFunction[] = boardState.postMoveFunctions || [];
		
	enginePostMoveActions.forEach(postMove => {
		if (!postMove.moveNumber || postMove.moveNumber === boardState.moveNumber)
			postMove.action(destination.piece, boardState, this);
	});	
	boardState.moveNumber++;
	boardState.postMoveFunctions = enginePostMoveActions.filter(pmf => !pmf.moveNumber || pmf.moveNumber >= boardState.moveNumber);

	// We only call post move functions if we're saving state
	if (!saveToBoard) return boardState;
	
	this.postMoveFunctions.forEach(moveFn => {
		moveFn.action(destination.piece, boardState, this);
	});	
	this.boardState = boardState;	
	return boardState;
}