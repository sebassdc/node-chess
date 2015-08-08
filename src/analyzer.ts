import Chess = require("node-chess");
import Engine = require("./engine/engine");
export = Analyzer;

class Analyzer {
	constructor(engine: Engine, options?: Chess.AnalysisOptions) {
		this.evaluation = 0;
		if (!options) options = {};
		this.options.interval = options.interval || 100;
		this.options.depth = options.depth || 5;
		this.options.time = options.time || 5;
		this.startTime = Date.now();
	}

	calculate(callback: (evaluation: number) => any): void {
		//TODO
		callback(this.evaluation);
	}

	evaluation: number;
	options: Chess.AnalysisOptions = {};
	startTime: number;
}
