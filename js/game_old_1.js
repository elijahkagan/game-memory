$( document ).ready( function game() {
	console.log("Starting the game");
	var iteration = 0;
	var cardCount = 0;
	var gameDepth = 2;
	var matchFound = 0;
	var finalMove = 7;
	var tipMessage = "";
	var boardSize =[208,333,444] 
	var idLibrary =[];
	var WELCOME = '#screen_welcome' ;
	var BOARD = '#screen_game' ;
	var FINAL = '#screen_results';
	var idLibrary = [];
 	var symbolLibrary = [ 
 		'fa-glass' , 
 		'fa-check' , 
 		'fa-gear' , 
 		'fa-qrcode' , 
 		'fa-gift' , 
 		'fa-fire' ,
 		'fa-calendar' ,
 		'fa-magnet' ,
 		'fa-chevron-up' ,
 		'fa-folder',
 		'fa-cogs'
 		]
 	var target = "";
 	var tagretIdMatrix = {};

 	//choose difficulty
	$('.difficulty_button').click(function() {
		var dataDiff = $(this).attr('difficulty');
		console.log("Starting difficulty level: " + dataDiff + "!");
		gameBoard(dataDiff);
		$(WELCOME).addClass('hide');
		$(BOARD).removeClass('hide');
	});
	
	// play again trigger 
	$('.play_again').click(function() {
		matchFound = 0;
		iteration = 0;
		$(FINAL).hide().addClass( 'hide' );
		$(WELCOME).removeClass( 'hide' );
		var emptyGameBoard = document.getElementById( 'game_board' );
		emptyGameBoard.innerHTML = '';
		tip_message = '';
		idLibrary = [];
		console.log("Starting the game again");
	});



	$('#game_board').on('click','.memory_card_iteration', function() {
	/* B: While game depth is not reached the clicked card will be selected and the content of the card will be assigned with consecutive number.
		*/
		//console.log("i:" + iteration);
 		//console.log("m:" + matchFound);

	if ( matchFound < finalMove ) { 
		if ( iteration < gameDepth ) {
			if ( !( $( this ).hasClass( 'selected' ) )) {
				$( this ).addClass( 'selected');
										//$( this ).attr('x'); //get the id of the element and read what is the css class bound for content for this ID and add proper class (+:before)
				 iteration += 1 ;
				 matchFound += 1 ;
				 move += 1 ;
												// //check target
												// var currentSymbol = $( this ).text()
												// if ( (target == '') || (target == currentSymbol ) ){

												// }


												//console.log( "Card revealed, move: " + matchFound +"!" );
			} else {
												//TO DO - animate decline 
				console.log('This Card is already revealed');	
			};
		} else {
			$('.selected').removeClass('selected');	
			$( this ).addClass( 'selected' );
										//$( this ).append('p').text(matchFound);
			iteration = 1 ; 
			matchFound += 1 ;
			move += 1 ; 
											//console.log("Geme depth reached " + iteration + "\n m: " + matchFound);
			};
		} else {
			console.log("moves done: " + matchFound);
			$( this ).addClass( 'selected');
			$( this ).append('p').text(matchFound);
			matchFound += 1; 
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






var craftTheMatrix = function( idLibrary , symbolLibrary ) { //gameDepth?
	//bind ids with symbols
	var symbolsMatrix = [];
	var idMatrix = [];
	//console.log(cardCount);
	var symbolStep = cardCount / gameDepth; // will provide a propper amount of symbols needed to asign all the ids
	console.log( "Crafting The Matrix");
	//console.log( "Symbols to craft: " + symbolStep );

	while ( symbolStep > 0 ) { 
		// fullfils array of symbols with randomly choosen symbols from symbolLibrary
		var rndSymindex = Math.floor( Math.random() * symbolLibrary.length );
		var symbol = symbolLibrary.splice( rndSymindex, 1 )[0];
		symbolsMatrix.push( symbol );
		symbolStep -= 1;
	}; 
	console.log( symbolsMatrix );
	//TODO both this functions should be a separate one with inputs.
	
	for ( Symbol in symbolsMatrix ) {
		//loop to assign n(ganeDepth)times ids inside one record of th idMatrix
		var repeatTarget = gameDepth;
		var idMatrixCell = []
		while ( repeatTarget > 0 )  { 
			//console.log("target: " + repeatTarget);
			var rndIdIndex = Math.floor( Math.random() * idLibrary.length );				
			//console.log("rndIdIndex: " + rndIdIndex);
			var idToSymbol = idLibrary.splice( rndIdIndex, 1 )[0];
			//console.log("idToSymbol: " + idToSymbol);
			idMatrixCell.push(idToSymbol);
			repeatTarget -= 1;
		};
		idMatrix.push(idMatrixCell);
		//console.log(idMatrixCell);
	};
		console.log(idMatrix );
	};





var gameBoard = function( difficulty ) {
	// creates a game board content withing given constraints and append it to the game placeholder
	var cardCountArray = { kid: 16 , expirienced: 64 , unicorn : 96 }
		cardCount = cardCountArray[ difficulty ]
	if ( difficulty == 'unicorn' ) {
		gameDepth = 3;
		$('#tip_message').append("Watch out! This time you have to find 3 identical cards.");
	} else  {
		gameDepth = 2;
	}
	//console.log("Cards to serve" + cardCount);
	var fillGameBoard = document.getElementById("game_board");
	var createCardsIteration = cardCount;
	while (createCardsIteration > 0) {
		createCardsIteration -= 1;
		var cardTemplate = "<li>";
		var cardID = 'card' + createCardsIteration;
		$( cardTemplate ).addClass( 'memory_card_iteration fa' ).attr( 'id' , cardID ).prependTo(fillGameBoard);
		//console.log("	Card created, " + cardCount + "left to do!" );
		idLibrary.push(cardID);
	};
	//library preview
	console.log(idLibrary);
	//hidden before the users eyes the goals are bound with ids, this will make cheeting a bit more difficult :)
	craftTheMatrix( idLibrary , symbolLibrary );
	
	};


//on load end
});

// generate cards content
// check if the cards are the same,
// show moves - show points
// show max points info








/*
// show welcom screen //

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



	// do it until there is no id to assign while or for each
	// var step = 0;
	// 
	// var idInFocus = 0;
	// console.log( iDlibLength );
	// var matrix = [];
	// //add checkpoint if liblength /game depth modulo is 0  
	// while ( idInFocus < iDlibLength ) {
	// 	idInFocus += 1;
	// 	var futureTarget = 

	// };

	//var idMatrix = [];
	//var iDMatrix = idLibrary;
	
	// while ( idlibrary.length() > 0 ) {
	// 	var rndID = Math.floor( Math.random() * iDlibLength );
	// 	idlibrary 

		

	// 		var iDlibLength = idLibrary.length();
	// 		
	// 		idlibrary(rndsym).append(idMatrix)
	// }

    //reset the symbol after gameDepth is reached
   
 //    	while ( step > 0 ) { //gameDepth 
	// 		return symbol
	// 	}


	



	// var rndSym = Math.floor( Math.random() * iDlibLength );

	// console.log( "post" + idLibrary);

	
	 // choose random id from library to assign 
	 //append a pair of ID,symbol to tagretIdMatrix
	 

	 // for each idlibrary
	 // tagretIdMatrix.append( id )	



	// var	object = {
	// 	class : "fa,xxxx";
	// 	id : [12,24,46];

	// }


