$( document ).ready( function game() {
	console.log("Starting the game");
	var iteration = 0;
	var gameDepth = 2;
	var moveCounter = 0;
	var finalMove = 7;
	var tipMessage = "";
	var WELCOME = '#screen_welcome' ;
	var BOARD = '#screen_game' ;
	var FINAL = '#screen_results';

	$('.difficulty_button').click(function() {
		var dataDiff = $(this).attr('difficulty');
		console.log("Starting difficulty level: " + dataDiff + "!");
		gameBoard(dataDiff);
		$(WELCOME).addClass('hide');
		$(BOARD).removeClass('hide');
	});

	$('.play_again').click(function() {
		moveCounter = 0;
		iteration = 0;
		$(FINAL).addClass( 'hide' );
		$(WELCOME).removeClass( 'hide' );
		var emptyGameBoard = document.getElementById( 'game_board' );
		emptyGameBoard.innerHTML = '';
		console.log("Starting the game again");
	});

	var target = '' ;
	$('#game_board').on('click','.memory_card_iteration', function() {
	/* B: While game depth is not reached the clicked card will be selected and the content of the card will be assigned with consecutive number.
		*/
		console.log("i:" + iteration);
 		console.log("m:" + moveCounter);
	if ( moveCounter < finalMove ) { 
		if ( iteration < gameDepth ) {
			if ( !( $( this ).hasClass( 'selected' ) )) {
				$( this ).addClass( 'selected');
				$( this ).append('<p>' + moveCounter + '</p>').attr('symbol',moveCounter);
				 iteration += 1;
				 moveCounter += 1; 
				// //check target
				// var currentSymbol = $( this ).text()
				// if ( (target == '') || (target == currentSymbol ) ){

				// }


				//console.log( "Card revealed, move: " + moveCounter +"!" );
			} else {
				//TO DO - animate decline 
				//console.log('This Card is already revealed');	
			};
		} else {
			$('.selected').removeClass('selected');	
			$( this ).addClass( 'selected' );
			$( this ).append('p').text(moveCounter);
			iteration = 1; 
			moveCounter += 1; 
			//console.log("Geme depth reached " + iteration + "\n m: " + moveCounter);
			};
		} else {
			console.log("moves done: " + moveCounter);
			$( this ).addClass( 'selected');
			$( this ).append('p').text(moveCounter);
			moveCounter += 1; 
			$(BOARD).delay(700).queue(function(next) {
  				$(this).addClass('hide');
  			next();
  			});
  			$(BOARD).delay(750).queue(function(next) {
  				$(FINAL).removeClass('hide');
  			next();
  		});	
		};
	});
});
var symbolLibrary =[]
var gameBoard = function(difficulty) {
	// function will create a gameboard content withing given constraints and append it to the game placeholder
	var cardCountArray = { kid: 16 , expirienced: 64 , unicorn : 96 , }
	var cardCount = cardCountArray[ difficulty ]
	if ( difficulty == 'unicorn' ) {
		gameDepth = 3;
		$('#tip_message').append("Watch out! This time you have to find 3 identical cards.");
	} else  {
		gameDepth = 2;
	}
	//console.log("Cards to serve" + cardCount);

	var fillGameBoard = document.getElementById("game_board");
	while (cardCount > 0) {
		cardCount -= 1;
		var cardTemplate = "<li>"
		$(cardTemplate).addClass('memory_card_iteration').appendTo(fillGameBoard);
		//console.log("	Card created, " + cardCount + "left to do!" );

	};
	// $( '#gameboard li' ).attr('id', function(i) {
 //   		return 'symbol'+(i+1);
	// 	});
};


// generate cards content
// check if the cards are the same,
// show moves - show points
// show max points info








/*
// show welcom escreen //

on difficulty setup choice 
hide the initial screen (slideup) (slide down) (3d rotate hide)
the board is made:
add cards each with proper id - create a matrix of id belonging to a certain class so ( class_1 ids = [1,8])
	card with id 1 or 2  (or more if game depth is more than 2)
screte class details so each class get it's own visual properties
add container classes - set proper width 

set counters for points  +1 for guessing, -1 for not finding a propper one,  counts only to 0
reveal the game board.

if memories left  > 0
	while gamedepth > 0
	on click -reveal the card there is alrady an id connected  we setup variable "target"  with this class if target empty  we set the target from "this" (get current class ID) we set this counter = depth -1 set moves +1

	if target not empty -  hit counter match current class with class of the target if there is a hit change the root class of the card so it became unclickable and add class that dimms the look set points +1 set moves to +1  memoriesleftto find -1
		if there is no match clean reset the visibility of the cards this and the one with the target, clean target, reset game depth, set point -1 set moves +1
if memories lest is 0 
	get current points and moves and show it respectively - append appropriate placeholders
	hide boadr game  and show the winning board 
	winnning board has a play again button that resets hides winning pannel and shows the welcome panel - it also resets the difficulty and points an moves and target




send difficulty to the game - function that prepares the game board  and appends game cards in necesary ammount data to the game container,  according to the game difficulty and to the settings also ads proper class to the container.:
set the the group of iterations as a library ( class : related symbol - best if it's random)

on click function: if there count of good matches is lover than the set initial amout to win than do:

on click - this card gets class from the library and 


*/

