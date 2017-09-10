$( document ).ready( function game() {
	//talking to myself
	console.log( "Starting the game" );
	var iteration = 0 ;
	var cardCount = 0 ;
	
	var gameDepth = 1 ; // ! One (1) matching card needed to get 
	var matchFound = 0 ; //old
	
	var tipMessage = '' ;
	var idLibrary = [] ;
 	var tagretIdMatrix = {} ;
 	var memoryMatrix = {} ;

	var shot = '' ;
	var shotSymbolClass = '' ;
	var target = '' ;
	var matchesFound = 0 ;
	var points = 0 ;
	var moves = 0 ;
	var goal = 0 ;

	var WELCOME = '#screen_welcome' ;
	var BOARD = '#screen_game' ;
	var FINAL = '#screen_results' ;

// UI updating functions 
var updateTip = function( message ) {
		 var tip = $( '#tip' );
		 tip.empty();
		 tip.text( message );
	};

var updatePoints = function( localPoints ) {
		var pointsContainer = $( '#points' );
		pointsContainer.empty();
		pointsContainer.text( 'Points: ' + localPoints );
	};

var updateMoves = function( localMoves ) {
		var movesContainer = $( '#moves ' );
		movesContainer.empty();
		movesContainer.text( 'Moves: ' + localMoves );
	};
var updateMatches = function(matches) {
	var machesContainer = $( '#matches' );
		machesContainer.empty();
		machesContainer.text( 'Matches found: ' + matches );
}

// Game resources 
var craftTheMatrix = function( idLibrary , symbolsLibrary ) { //gameDepth?
	//bind ids with symbols
	var symbolsMatrix = [];
	//console.log(cardCount);
	var symbolStep = cardCount / gameDepth; // will provide a propper amount of symbols needed to asign all the ids also its a goal for proper matches
	//assigning proper amount of matches to be found
	goal = symbolStep / 2 ;
	
	console.log( "Crafting The Matrix" ); //talking to myself

	while ( symbolStep > 0 ) { 
		// fullfils array of symbols with randomly choosen symbols from symbolsLibrary
		var rndSymindex = Math.floor( Math.random() * symbolsLibrary.length );
		var symbol = symbolsLibrary.splice( rndSymindex , 1 )[ 0 ];
		symbolsMatrix.unshift( symbol );
		symbolStep -= 1 ;
	}; 
	
	// !console.log( symbolsMatrix ); // !talking to myself
	

	//TODO both this functions should be a separate one with inputs.
	symbolsMatrix.forEach( function ( symbolItem ) {
		//loop to assign n(ganeDepth)times ids inside one record of th idMatrix
		//console.log( symbolItem );
		var repeatTarget = gameDepth ;
		while ( repeatTarget >= 0 )  {
			//console.log("target: " + repeatTarget);
			var rndIdIndex = Math.floor( Math.random() * idLibrary.length );				
			//console.log("rndIdIndex: " + rndIdIndex);
			var idToSymbol = idLibrary.splice( rndIdIndex , 1 )[ 0 ];
			//console.log("idToSymbol: " + idToSymbol);
			var memoryMatrixCell = { [ idToSymbol ] : symbolItem };
			$.extend( memoryMatrix , memoryMatrixCell );
			repeatTarget -= 1 ;
		};
	});
		// !console.log( memoryMatrix );
	};


var gameBoard = function(difficulty) {
	// function will create a gameboard content withing given constraints and append it to the game placeholder
	var cardCountArray = { kid: 16 , expirienced: 64 , unicorn : 96 }
		cardCount = cardCountArray[ difficulty ]
	if ( difficulty == 'unicorn' ) {
		gameDepth = 2;
		$('#tip_message').append("Watch out! This time you have to find 3 identical cards.");
	} else  {
		gameDepth = 1;
	}
	//console.log("Cards to serve" + cardCount);
	var fillGameBoard = document.getElementById("game_board");
	var createCardsIteration = cardCount;
	while (createCardsIteration > 0) {
		createCardsIteration -= 1;
		var cardTemplate = "<li>";
		var cardID = 'card' + createCardsIteration;
		//$( cardTemplate ).addClass( 'card memory_card_iteration' ).attr( 'id' , cardID ).prependTo(fillGameBoard);
		$( cardTemplate ).addClass( 'card memory_card_iteration' ).attr( 'id' , cardID ).prependTo(fillGameBoard);
		//console.log("	Card created, " + cardCount + "left to do!" );
		idLibrary.push(cardID);
	};
	//library preview
	// !console.log(idLibrary);
	//hidden before the users eyes the goals are bound with ids, this will make cheeting a bit more difficult :)
	craftTheMatrix( idLibrary , symbolsLibrary );
	
	};

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
		updateTip('');
		idLibrary = [];
		console.log( "Starting the game again - awesome") ;
	});

var localGameDepth = gameDepth;
	$('#game_board').on('click','.memory_card_iteration', function oneBigFunction() {
		//B: While game depth is not reached the clicked card will be selected and the content of the card will be assigned with consecutive number.
		// 	allow clicking in groups of length of game depth - while localGameDepth > 0 {
		console.log(localGameDepth);

				if ( !( $( this ).hasClass( 'selected' ) )) {
		//			mark as selected 		
					$( this ).addClass( 'selected' );
		//			set shot = symbolsMatrix.this id
					shot = $( this ).attr( 'id' );
		//			get class symbol from memoryMatrix object			
					shotSymbolClass = memoryMatrix[ shot ];	
		//			assign class to clicked card		
					$( this ).addClass( shotSymbolClass );
					
		//			if target not set {
					if ( target == '') { 
		//				target = shot;
						target = shotSymbolClass;	
						console.log("Target was empty, now target is:" + target);
		//			} else (target was set before) 
					} else {
						console.log("Target was assigned earlier and is set to: " + target);
						console.log("New shot symbol is: " + shotSymbolClass);
		//				//target was not empty so i dont have to reasign 
						//if target == shot {
						if ( target == shotSymbolClass ) {
		//					localGameDepth -= 1
							localGameDepth -= 1 ;
							console.log( "We have a match", localGameDepth )
		//					TODO animate that elements with confirmation 
		//						if  localGameDepth = 0 {
							var winMeCard = $('.selected');
							winMeCard.effect( "bounce", { direction : "up", distance : 11 , mode: "effect" , times: 5.}, 300 );
							winMeCard.addClass('matched_cards');
							winMeCard.removeClass('memory_card_iteration');
							winMeCard.removeClass('selected');

							if  ( localGameDepth == 0 ) {
		//								matchesFound += 1;
										matchesFound += 1 ;
										updateMatches(matchesFound)
										points += 1 ;
										updatePoints( points );
	//									moves += 1;
										moves += 1 ;
										updateMoves( moves );	
		//								if matchesFound < goal 
										if ( matchesFound < goal ) {
											console.log("keep finding matching cards");
											
											console.log(goal, matchesFound);
											localGameDepth = gameDepth;
		//									point += 1;
					//						select selected clases and add to them class matched than remove class  'clickable and selected' a()								
		//									} else - matches found = goal {
											} else {
		//									toltip = you won	
											updateTip('You won - Congratulations');
		//									select all acards and and add a :winner class 
												$('.card').addClass('winner_cards'); //needs improvment
		//									start winnerfound function.	
												$(BOARD).delay(700).queue(function(next) {
	  											$(this).addClass('hide');
	  											next();
	  											});
							  					$(BOARD).delay(750).queue(function(next) {
							  					$(FINAL).removeClass('hide');
							  					next();
	  											});		
												}; 
							}; 	
		//				} else (target != shot{ 
						} else {
		//				points -= 1;
							points -= 1 ;
							console.log(" We dont have a match " + target + " " + shotSymbolClass + " " + localGameDepth  );
							updatePoints( points );
		//					moves += 1;					
							moves += 1 ;
							updateMoves( moves );
		//					local game depth = game depth 				 
							localGameDepth = 0 ;
							$('.selected').removeClass( target);
							console.log(shot + "e")
							$(shot).removeClass(shotSymbolClass);				
							$('.selected').removeClass( 'selected' ) ;
							localGameDepth = gameDepth;
							$( this ).addClass( 'selected' );
		//					set shot = symbolsMatrix.this id
							shot = $( this ).attr( 'id' );
		//					get class symbol from memoryMatrix object			
							shotSymbolClass = memoryMatrix[ shot ];	
		//					assign class to clicked card		
							$( this ).addClass( shotSymbolClass );
							target = shotSymbolClass ;


							}
						};
		//			} else to not selected (so it's selected ){
					} else {
		//			TODO animate icon so it's shaking
		//			print tip - that element is selected 
					updateTip("This Card is already revealed!");				
					console.log('This Card is already revealed');		
					};
	});


//on load ends
});
