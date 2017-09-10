var memoryGame = { 
	// The Memory Game object
	// Game settings
	difficulty : { 'kid' : [ 16 , 2 ] , 'expirienced' : [ 72 , 2 ] , 'unicorn' : [ 36 , 3 ] } , 
	hideCardsDelay : 633 ,
	// The difficulty array is composed of a two elements: [ cardsCount , cardsPairLength ]. The first value, aka cardsCount, states the ammount of all of the cards the game board contains. The second value: 'cardsPairLength', represents the ammount of similar cards a player has to reveal, in one pass, to suceed in singular mamory Game step. Example: in a standard game a pair of cards states for two similar cards but in unicorn game a pair sates for 3 similara games. 
	
	// Game UI variable containers
	scrA : $( '#screen_welcome' ),
	scrB : $( '#screen_game' ),
	scrC : $( '#screen_results' ),
	gameBoardElement : $( '#game_board' ),
	movesContainer : $( '#moves' ),
	pointsContainer : $( '#points' ),
	tipContainer : $( '#tip' ),
	finalResultContainer : $( '.final_result_container' ),

	// Game processing
	pickedCard : '' ,
	cardsIdLibrary : [] ,
	symbolsForTheGame : [] ,
	gameMatrix : {} ,
	gameCardsIteration : 0 ,
	cardsPairLength : 0 ,

	tipMessage : '' , 
	
	cardsSelected : [] ,
	pairsRevealed : 0 ,

	// Game results 
	moves : 0 ,
	points : 0 ,
	finalResult : '' ,

	// Game methods
	craftGameMatrix : function(symbolsLibrary) {
		// B: Creates an arrays wchich elements consists of randomly chosen symbols that are used as a unique library of symbols for the incomming game
		// I:
		// O:
		//console.log(cardCount);
		var symbolStepCount = memoryGame.gameCardsIteration / memoryGame.cardsPairLength // will provide a propper amount of symbols needed to asign all the ids also its a goal for proper matches
		// this proportion is setting a proper amount of matches to be found.for gameDepth 2 the ammount of symilar cards pairs 

		while ( symbolStepCount > 0 ) { 
			// fullfils array of symbols with randomly choosen symbols from symbolsLibrary
			var rndSymindex = Math.floor( Math.random() * symbolsLibrary.length );
			var symbol = symbolsLibrary.splice( rndSymindex , 1 )[ 0 ];
			memoryGame.symbolsForTheGame.unshift( symbol );
			symbolStepCount -= 1 ;
		};
		//console.log( "Crafted the Matrix of symbols" );
		//console.log( memoryGame.symbolsForTheGame );

		memoryGame.symbolsForTheGame.forEach( function ( symbolIndex ) {
		//loop to assign n times (on the basis of the cardPairLength ) ids inside one record of th idMatrix
		//console.log( symbolIndex );
		var localCardsPairLength = memoryGame.cardsPairLength ;
		while ( localCardsPairLength > 0 )  {
			//console.log("target: " + cardsPairLength);
			var rndIdIndex = Math.floor( Math.random() * memoryGame.cardsIdLibrary.length );				
			//console.log("rndIdIndex: " + rndIdIndex);
			var idToSymbol = memoryGame.cardsIdLibrary.splice( rndIdIndex , 1 )[ 0 ];
			//console.log("idToSymbol: " + idToSymbol);
			var memoryMatrixCell = { [ idToSymbol ] : symbolIndex };
			$.extend( memoryGame.gameMatrix , memoryMatrixCell );
			localCardsPairLength -= 1 ;
		};

		});
		//console.log( "Crafted the Game Matrix" );
		//console.log( memoryGame.gameMatrix );
	} ,

	gameBoard : function( difficultyChoice )  {
		// function will create a gameboard content withing given constraints and append it to the game placeholder
		memoryGame.gameCardsIteration =  difficultyChoice[ 0 ];
		memoryGame.cardsPairLength = difficultyChoice[ 1 ];
		var localgameCardsIteration = memoryGame.gameCardsIteration;
		while ( localgameCardsIteration > 0 ) {
			localgameCardsIteration -= 1 ;
			var cardTemplate = '<li><a></a></li>' ;
			var cardID = 'card' + localgameCardsIteration;
			$( cardTemplate ).addClass( 'card memory_card_iteration' ).attr( 'id' , cardID ).prependTo( memoryGame.gameBoardElement );
			memoryGame.cardsIdLibrary.push( cardID );
		};
		memoryGame.craftGameMatrix( symbolsLibrary );
		memoryGame.setBoardSize();
		memoryGame.switchGameView( memoryGame.scrA , memoryGame.scrB , 1 );
	} ,

	setBoardSize : function() {
		var targetBoard = $( '.game_child_container' );
		if ( memoryGame.gameCardsIteration == 16 ) {
			targetBoard.addClass( 'small' );
		} else if ( memoryGame.gameCardsIteration == 72 ) {
			targetBoard.addClass( 'large' );
		} else {
			targetBoard.addClass( 'medium' );
		};
	} ,
	
	switchGameView : function( viewToHide , viewToShow , option ) {
		viewToHide.addClass( 'move_up' );
		
		if ( option == 1) {
			memoryGame.toggleGameBackgrounds();
		};
	
		setTimeout(function(){
       		viewToHide.addClass( 'hide' );
       		viewToHide.removeClass( 'move_up' );
       		
       		viewToShow.addClass( 'shifted_down' );
       		viewToShow.removeClass( 'hide' );
			setTimeout(function(){
				viewToShow.removeClass( 'shifted_down' );
   			}, 0);
   		}, 200);
	},	

	selectTheCard : function( clickedCard ) {
		//console.log( memoryGame.cardsSelected );
		if ( !( clickedCard.hasClass( 'selected' ) )) {
			clickedCard.addClass( 'selected' );
			var clickId = clickedCard.attr( 'id' );
			var clickSymbolClass = memoryGame.gameMatrix[ clickId ];	
			//console.log( clickSymbolClass );
			var innerSymbol = clickedCard.find('a');
			//innerSymbol.fadeIn( 0 );
			innerSymbol.addClass( clickSymbolClass );
			memoryGame.cardsSelected.push( clickId );
			//console.log(memoryGame.cardsSelected);
			memoryGame.showMatchingCards(clickSymbolClass);
			memoryGame.checkThePair();
		} else {
			var innerSymbol = clickedCard.find('a');
			innerSymbol.addClass( 'nonono' );
			memoryGame.updateTip( "This Card is already revealed!" );
			setTimeout(function() {
					innerSymbol.removeClass( 'nonono' );
				}, 200);
			};
	} ,

	showMatchingCards : function( clickSymbolClass ) {
		var lists = $( '.memory_card_iteration' );
		//console.log(lists);
			lists.each( function() {
			var thisCardId = $( this ).attr( 'id' );
			var thisSymbolClass = memoryGame.gameMatrix[ thisCardId ];
			//console.log(thisSymbolClass);
			if ( thisSymbolClass == clickSymbolClass) {
				$(this).addClass( 'matching_cards' );
			};
		});
	} ,

	checkThePair : function() {
		var cardsToMatch = memoryGame.cardsSelected.length ;
		//console.log( "cardsToMatch: " + cardsToMatch );
		if ( cardsToMatch > 1 ) {
			//console.log( "starting matching process of:" +  cardsToMatch + "elements" );
			var matchingSymbolId = memoryGame.cardsSelected[ 0 ];
			var matchingSymbolClass = memoryGame.gameMatrix[ matchingSymbolId ];
			//console.log("	Entry Symbol: " + matchingSymbolClass);
			for (idIndex in memoryGame.cardsSelected) {
				//console.log( "	Next Symbol Class: " + memoryGame.cardsSelected[idIndex] );
				var nextMatchingidIndex = memoryGame.cardsSelected[ idIndex ] ; 
				//console.log("	nextMatchingidIndex: " + idIndex);
				var nextMatchingSymbolClass = memoryGame.gameMatrix[ nextMatchingidIndex ];
				//console.log("	nextMatchingSymbolClass: " + nextMatchingSymbolClass );
				if ( matchingSymbolClass != nextMatchingSymbolClass ) {
					memoryGame.pairingFailed();
					return;
				} else {
					//console.log("All revealed cards are the same!")
				};
			};
			//console.log("			cardsToMatch:" + cardsToMatch );	
			//console.log("			matchlength:" + (memoryGame.cardsPairLength) );
			if ( cardsToMatch == memoryGame.cardsPairLength ) {  
				memoryGame.thePairMatched();
				} else {
				memoryGame.updateTip( "Almost there! Keep on picking!" );
				};
		} else {
		  //console.log( "Wow, welcome card, you'r the first one!" );
		};
	} ,

	pairingFailed : function() {
		memoryGame.updateStats( -1 );
		//console.log("the pair failed in:" + memoryGame.cardsSelected );
		memoryGame.cardsSelected.forEach( function( content ){
			//console.log("removing selected class from" + content ); 
			var thisCard = $( "#" + content );
			thisCard.removeClass('selected');
			var thisInnerSymbolClass = memoryGame.gameMatrix[ content ];
			var innerSymbol = thisCard.find('a');
			innerSymbol.addClass( 'nonono' );
			memoryGame.updateTip( "This are not a matching cards!" );
			//innerSymbol.fadeOut( 300 ); TODO - protection agains fast clicking
			setTimeout(function() {
			 	innerSymbol.removeClass( 'nonono' );
			 	innerSymbol.removeClass( thisInnerSymbolClass );
			 	//innerSymbol.fadeOut( 300 );  TODO - protection agains fast clicking
				}, memoryGame.hideCardsDelay );
		});
		memoryGame.cardsSelected = [] ;
	} ,
	
	thePairMatched : function() {
		//console.log( "The Pair Matched" );
		memoryGame.updateTip( "Awesome, you found it!" );
		memoryGame.updateStats( 1 );
		memoryGame.pairsRevealed += 1;
		//console.log( "memoryGame.pairsRevealed " + memoryGame.pairsRevealed );
		memoryGame.cardsSelected.forEach( function( content ){
			//console.log("removing selected class from" + content ); 
			var thisCard = $( "#" + content );
			var thisInnerSymbolClass = memoryGame.gameMatrix[ content ];
			var innerSymbol = thisCard.find('a');
			innerSymbol.addClass( 'matched_symbols' );
			thisCard.addClass( 'matched_cards' );
			thisCard.removeClass( 'matching_cards' ); //comment it out
			thisCard.removeClass( 'memory_card_iteration' );
			thisCard.removeClass( 'selected' );
			});

		memoryGame.cardsSelected = [] ;
		//console.log( memoryGame.cardsSelected );
		memoryGame.checkIfGameWon();

	} ,

	checkIfGameWon : function() {
		//console.log( memoryGame.pairsRevealed );
		if ( memoryGame.pairsRevealed < memoryGame.gameCardsIteration/memoryGame.cardsPairLength ){
			//console.log( " continue searching " );
		} else {
			//memoryGame.updateTip( );
			memoryGame.updateFinalResults();

			$( '.matched_cards' ).each( function( index ) {
    			var innerSymbol = $(this).find('a');
    			setTimeout(function() {
    				innerSymbol.removeClass( 'matched_symbols' );
    				innerSymbol.addClass( 'winning_symbols' );
        		}, index * 66); 
			});

			setTimeout( function() {
				memoryGame.gameBoardElement.removeClass( 'matched_symbols' );
				memoryGame.switchGameView( memoryGame.scrB , memoryGame.scrC , 0 );
   			}, 999 );
		};
	},

	updateTip : function( message ) {
		//var tip = $( '#tip' );
		memoryGame.tipContainer.show();
		memoryGame.tipContainer.empty();
		memoryGame.tipContainer.text( message );
		setTimeout( function() {
			memoryGame.tipContainer.fadeOut( 800 );
   			}, 999 );
		} ,

	updateMoves : function() {
		memoryGame.moves += 1 ;
		memoryGame.movesContainer.empty();
		memoryGame.movesContainer.text( 'Moves: ' + memoryGame.moves );
		//console.log("Moves updated to" + memoryGame.moves );
		} ,

	updateStats : function( vector ) {		
		memoryGame.points += vector ;
		var pointsContainer = $( '#points' );
		memoryGame.pointsContainer.empty();
		memoryGame.pointsContainer.text( "Points: " + memoryGame.points );	
		//console.log("Points updated to" + memoryGame.points );
		memoryGame.updateMoves();
		} ,

	toggleGameBackgrounds : function() {
		var gameBody = $( '.game' );
		if (gameBody.hasClass( 'game_backgrounds' )) {
			gameBody.removeClass( 'game_backgrounds' );
		} else {
			setTimeout( function() {
				gameBody.addClass( 'game_backgrounds' );
   			}, 500 );
		};
	},

	updateFinalResults : function () {
		if ( memoryGame.points == 1 || memoryGame.points == -1 ) {
				memoryGame.finalResult =  "You collected " + memoryGame.points + " point in " + memoryGame.moves + " moves!" ;
			} else {
				memoryGame.finalResult = "You collected " + memoryGame.points + " points in " + memoryGame.moves + " moves!" ;
			};
		memoryGame.finalResultContainer.empty();
		memoryGame.finalResultContainer.text( memoryGame.finalResult );
		memoryGame.litTheStars();
	},
	
	litTheStars : function() {
		var starIndex = 0 ;
		var resultQuality = Math.round(( memoryGame.gameCardsIteration + memoryGame.points)/( memoryGame.moves ) * 100) / 100;
			if( resultQuality > 0.75 ) {
				starIndex = 5 ;
			} else if ( resultQuality > 0.5 ) {
				starIndex = 4 ;
			} else if ( resultQuality > 0.3 ) {
				starIndex = 3 ;
			} else if ( resultQuality > 0.2 ) {
				starIndex = 2 ;
			} else if ( resultQuality > 0.1 ) {
				starIndex = 1 ;
			} else {
				starIndex = 0;
			};
		 //console.log( resultQuality , starIndex );
		// console.log($( '.stars' ));
		
		$( '.stars' ).each( function( i ) {
			if ( i < starIndex) {
				//console.log(i);
				var innerSymbol = $( this );//.find('li');
					innerSymbol.removeClass( 'stars--gold' );	
					//console.log(innerSymbol);
					setTimeout( function() {
						innerSymbol.addClass( 'stars--gold' );
    				}, i * 633); 
				};
			});
	},
	
	resetData : function() {
		//console.log( "Resetting!" );
		memoryGame.pickedCard = '' ;
		memoryGame.symbolsForTheGame = [] ;
		memoryGame.gameMatrix = {} ;
		memoryGame.gameCardsIteration = 0 ;
		memoryGame.cardPairLength = 0 ;

		memoryGame.tipMessage = '' ; 

		memoryGame.cardsSelected = [] ; 
		memoryGame.pairsRevealed = 0 ;

		memoryGame.moves = 0 ;
		memoryGame.points = 0 ;

		//clean containers
		memoryGame.updateTip( '' );
		memoryGame.pointsContainer.empty();
		memoryGame.pointsContainer.text( "Points: " + memoryGame.points );
		memoryGame.movesContainer.empty();
		memoryGame.movesContainer.text( "Moves: " + memoryGame.moves );
		memoryGame.gameBoardElement.empty();
		var targetBoard = $( '.game_child_container' ).attr( 'class' , 'game_child_container' ); //TODO
		// Switch views 
		//console.log( "Starting the game again - that's awesome!") ;
		} ,

};
