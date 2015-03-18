var ann = require('node-ann');
// Returns an initialised network of the required configuration
module.exports = (function() {
	/*
	* Create and configure network
	*/
	network = new ann.ann({
		dataFormat: {'input', 'input', 'output'},
		epochs: 10000
	});
	/*
	* Create and configure perceptrons
	*/
	var currentMarket = new ann.perceptron({id: 'currentMarket', type: 'input'}),
		word = new ann.perceptron({id: 'word', type: 'input'}),
		h1 = new ann.perceptron({id: 'h1'}),
		h2 = new ann.perceptron({id: 'h2'}),
		h3 = new ann.perceptron({id: 'h3'}),
		h4 = new ann.perceptron({id: 'h4'}),
		predictedChange = new ann.perceptron({id: 'predictedChange', type: 'output'});
	// Add input perceptrons to network	
	network.addPerceptron(currentMarket);
	network.addPerceptron(word);
	// Add hidden perceptrons to network
	network.addPerceptron(h1);
	network.addPerceptron(h2);
	network.addPerceptron(h3);
	network.addPerceptron(h4);
	// Add output perceptron to network
	network.addPerceptron(predictedChange);
	// Form logical layers, 1 input layer, 1 hidden layer, 1 output layer
	network.addLayer(['currentMarket', 'word']);
	network.addLayer(['h1', 'h2', 'h3', 'h4']);
	network.addLayer(['predictedChange']);
	// Fully interconnect input to hidden and hidden to output
	network.fullyInterconnect([0, 1]);
	network.fullyInterconnect([1, 2]);
	// Return initialised network
	return network.initialise();
})();