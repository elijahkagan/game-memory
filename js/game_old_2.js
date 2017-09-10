$( document ).ready( function game() {
	//talking to myself
	console.log( "Starting the game" );
	var iteration = 0 ;
	var cardCount = 0 ;
	
	var gameDepth = 2 ;
	var matchFound = 0 ; //old

	var finalMove = 7 ; //changed to goal
	
	var tipMessage = '' ;
	var idLibrary = [] ;
 	var tagretIdMatrix = {} ;
 	var memoryMatrix = {} ;

	var shot = '' ;
	var target = '' ;
	var matchesFound = 0 ;
	var points = 0 ;
	var moves = 0 ;
	var goal = 0 ;

	var WELCOME = '#screen_welcome' ;
	var BOARD = '#screen_game' ;
	var FINAL = '#screen_results' ;

var craftTheMatrix = function( idLibrary , symbolsLibrary ) { //gameDepth?
	//bind ids with symbols
	var symbolsMatrix = [];
	
	//console.log(cardCount);
	var symbolStep = cardCount / gameDepth; // will provide a propper amount of symbols needed to asign all the ids also its a goal for proper matches
	//assigning proper amount of matches to be found
	goal = symbolStep ;
	//talking to myself
	console.log( "Crafting The Matrix" );
	//console.log( "Symbols to craft: " + symbolStep );
	while ( symbolStep > 0 ) { 
		// fullfils array of symbols with randomly choosen symbols from symbolsLibrary
		var rndSymindex = Math.floor( Math.random() * symbolsLibrary.length );
		var symbol = symbolsLibrary.splice( rndSymindex , 1 )[ 0 ];
		symbolsMatrix.unshift( symbol );
		symbolStep -= 1 ;
	}; 
	//talking to myself
	console.log( symbolsMatrix );
	

	//TODO both this functions should be a separate one with inputs.
	symbolsMatrix.forEach( function ( symbolItem ) {
		//loop to assign n(ganeDepth)times ids inside one record of th idMatrix
		//console.log( symbolItem );
		var repeatTarget = gameDepth ;
		while ( repeatTarget > 0 )  {
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
		console.log( memoryMatrix );
	};


var gameBoard = function(difficulty) {
	// function will create a gameboard content withing given constraints and append it to the game placeholder
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
		$( cardTemplate ).addClass( 'memory_card_iteration' ).attr( 'id' , cardID ).prependTo(fillGameBoard);
		//console.log("	Card created, " + cardCount + "left to do!" );
		idLibrary.push(cardID);
	};
	//library preview
	console.log(idLibrary);
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
		console.log("Starting the game again - awesome");
	});


	// UI updating functions 
	var updateTip = function( message ) {
		 var tip = $( '#tip' );
		 tip.empty();
		 tip.text( message );
	};

	var updatePoints = function( localPoints ) {
		var pointsContainer = $( '#points' );
		pointsContainer.empty();
		pointsContainer.text( localPoints );
	};

	var updateMoves = function( localMoves ) {
		var movesContainer = $( '#moves' );
		pointsContainer.empty();
		movesContainer.text( localMoves );
	};


	$('#game_board').on('click','.memory_card_iteration', function() {
		//B: While game depth is not reached the clicked card will be selected and the content of the card will be assigned with consecutive number.
		
		// 	allow clicking in groups of length of game depth - while localGameDepth > 0 {
		var localGameDepth = gameDepth;
		while ( localGameDepth > 0 ) {
		//		if not selected {
				if ( !( $( this ).hasClass( 'selected' ) )) {
		//			mark as selected 		
					$( this ).addClass( 'selected' );
		//			set shot = symbolsMatrix.this id
					shot = $( this ).attr( 'id' );
		//			get class symbol from memoryMatrix object			
					var targetSymbolClass = memoryMatrix[ card8 ];	
		//			assign class to clicked card		
					$( this ).addClass( targetSymbolClass );
		//			if target not set {
					if ( target = '') { 
		//				target = shot;
						target = shot;	
		//				localGameDepth -= 1;
						localGameDepth -= 1;
		//			} else (target was set before) 
					} else {
		//				if target == shot {
						if (target == shot) {
		//					localGameDepth -= 1
							localGameDepth -= 1 ;
		//					TODO animate that elements with confirmation 
		//						if  localGameDepth = 0 {
								if  ( localGameDepth == 0 ) {
		//								matchesFound += 1;
										matchesFound += 1 ;
		//								if matchesFound < goal 
										if ( matchesFound < goal ) {
		//									point += 1;
											points += 1 ;
											updatePoints( points );
		//									moves += 1;
											moves += 1 ;
											updateMoves( moves );		
					//						select selected clases and add to them class matched than remove class  'clickable and selected' a()								
											
											$('.selected').add('matched').removeClass('','selected');
											target = $(this).attr( 'id' );	
											$( this ).addClass( 'selected' );

											}

								}
		

					}
		//								} else {
		//									toltip = you won
		//									select all acards and and add a :winner class 
		//									start  winnerfound function.
		//								}
		//
		//								}	 
		//				} else (target != shot{
		//					moves += 1;
		//					points -= 1;
		//					select selected and remove target 
		//					select this and remove this class shot	
		//					local game depth = game depth 				 
		//				} 
		//		} else to not selected (so it's selected ){
		//			animate icon so it's shaking
		//			print tip - that element is selected 
		//			}
			};


		if ( matchFound < finalMove ) { 
			
			if ( iteration < gameDepth ) {
				if ( !( $( this ).hasClass( 'selected' ) )) {
					$( this ).addClass( 'selected');
					
					target = $(this).attr( 'id' );
					//console.log(memoryMatrix);
					//console.log(target)

					var targetSymbolClass = memoryMatrix[ target ];
					//console.log(targetSymbolClass);		

					$( this ).addClass( targetSymbolClass );
					iteration += 1 ;
					matchFound += 1 ;
			} else {
				updateTip("This Card is already revealed!");
				console.log('This Card is already revealed');	
			};
		} else {
			$('.selected').removeClass('selected');
			target = $(this).attr( 'id' );	
			$( this ).addClass( 'selected' );
				//$( this ).append('p').text(matchFound);
			iteration = 1 ; 
			matchFound += 1 ;
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

//on load ends
});
