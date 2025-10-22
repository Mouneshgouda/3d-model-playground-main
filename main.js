import { Game } from './game.js';
// Get the render target div
var renderDiv = document.getElementById('renderDiv');
// Check if renderDiv exists
if (!renderDiv) {
    console.error('Fatal Error: renderDiv element not found.');
} else {
    // Initialize the game with the render target
    var game = new Game(renderDiv);
    // Start the game
    game.start(); // The actual setup happens async within the Game class constructor
}
