/** 
	* @name: Memory Game object.
	* @description: An object that contains all the variables and methods to create and perform a classic memory game with some extra features.
	* @param: Library matching difficulty settings with game parameter setting. 
      The difficulty array is composed of a two elements: [ cardsCount , cardsPairLength ]. The first value, aka cardsCount, states the ammount of all the cards, that the game board contain. 
      The second value: 'cardsPairLength', represents the ammount of similar cards a player has to reveal/match in one game round to suceed in singular mamory Game step. 
      Example: in a standard game a pair of cards states for two similar cards but in unicorn difficulty game, a pair sates for  three cards with the same sysmbol. 
    */
var memoryGame = { 
	// * Settings
	difficulty : { 'kid' : [ 16 , 2 ] , 'expirienced' : [ 72 , 2 ] , 'unicorn' : [ 36 , 3 ] }, 
	hideCardsDelay : 633 ,

	// * Game UI variable containers
	scrA : $( '#screen_welcome' ),
	scrB : $( '#screen_game' ),
	scrC : $( '#screen_results' ),
	gameBoardElement : $( '#game_board' ),
	movesContainer : $( '#moves' ),
	pointsContainer : $( '#points' ),
	tipContainer : $( '#tip' ),
	finalResultContainer : $( '.final_result_container' ),

	// * Game processing 
	pickedCard : '' ,
	cardsIdLibrary : [] ,
	symbolsForTheGame : [] ,
	gameMatrix : {} , // My favourite! :)
	gameCardsIteration : 0 ,
	cardsPairLength : 0 ,
	cardsSelected : [] ,
	pairsRevealed : 0 ,

	// * Game state and results elements
	tipMessage : '' , 
	moves : 0 ,
	points : 0 ,
	finalResult : '' ,


	// * memoryGame methods

	/** 
 	  @Description: By the user choice of difficulty level, creates a game board of element with a specific ID. Then it initialises the process of making game variables and calls for the game view to show.
      In HTML it creates a game board content within given constraints and append it to the game placeholder
    * @param: difficultyChoice array describing a number of cards in the game, and the length of the pair of cards to match in the single matching round.
    */
	gameBoard : function( difficultyChoice )  {
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
	},	

	/** 
	  @description: Chooses random, different symbols for the game from the symbols library and appends them to object variable array. 
      For each of the selected symbols, it randomly picks cards ID and inflates a dictionary that describes the relationship between the card ID and the symbol assigned to it.
    * @param: Library of symbols, Amount of available cards in a game and the length of the pair.
    */
	craftGameMatrix : function(symbolsLibrary) {
		var symbolStepCount = memoryGame.gameCardsIteration / memoryGame.cardsPairLength 
		while ( symbolStepCount > 0 ) { 
			// Fulfils the array of symbols with randomly chosen symbols from symbolsLibrary
			var rndSymindex = Math.floor( Math.random() * symbolsLibrary.length );
			var symbol = symbolsLibrary.splice( rndSymindex , 1 )[ 0 ];
			memoryGame.symbolsForTheGame.unshift( symbol );
			symbolStepCount -= 1 ;
		};
		// console.log( memoryGame.symbolsForTheGame );
		memoryGame.symbolsForTheGame.forEach( function ( symbolIndex ) { 
		// Loop to assign n times (by the cardPairLength ) the symbol in an array of CardID.
		var localCardsPairLength = memoryGame.cardsPairLength ;
		while ( localCardsPairLength > 0 )  {
			// Choose random index of the card ID.
			var rndIdIndex = Math.floor( Math.random() * memoryGame.cardsIdLibrary.length );				
			// In the same step get the symbol class and remove it from the library.
			var idToSymbol = memoryGame.cardsIdLibrary.splice( rndIdIndex , 1 )[ 0 ];
			// Prepare data for injection to the memoryGame.gameMatrix library.
			var memoryMatrixCell = { [ idToSymbol ] : symbolIndex };
			// Extend the library with the data.
			$.extend( memoryGame.gameMatrix , memoryMatrixCell );
			localCardsPairLength -= 1 ;
		};
		});
		//console.log( memoryGame.gameMatrix );
	},

	/** 
	* @description: By the user choice, it adds the proper CSS class to the game cards container.
	* TODO: add an option for user customised game.
	*/
	setBoardSize : function() {
		var targetBoard = $( '.game_child_container' );
		if ( memoryGame.gameCardsIteration == 16 ) {
			targetBoard.addClass( 'small' );
		} else if ( memoryGame.gameCardsIteration == 72 ) {
			targetBoard.addClass( 'large' );
		} else {
			targetBoard.addClass( 'medium' );
		};
	},

	/** 
	* @description: Switches views by parameters.
	* @param: Takes in information about wich screen should be hidden and than wich screen should be shown. Also, considers an option of turning on background class in certain situations.
	*/
	switchGameView : function( viewToHide , viewToShow , option ) {
		viewToHide.addClass( 'move_up' );
		if ( option == 1) {
			memoryGame.toggleGameBackgrounds();
		};
		setTimeout(function(){
			// Stops the execution of actions so the user can experience a sequence of events/animations
       		viewToHide.addClass( 'hide' );
       		viewToHide.removeClass( 'move_up' );
       		viewToShow.addClass( 'shifted_down' );
       		viewToShow.removeClass( 'hide' );
			setTimeout(function(){
				viewToShow.removeClass( 'shifted_down' );
   			}, 0);
   		}, 200);
	},	

	/** 
	* @description: Reason about the card state, finds the proper symbol to display. Starts the process of matching the cards symbols.
    * @param: The Card object clicked by the user.
    */
	selectTheCard : function( clickedCard ) {
		if ( !( clickedCard.hasClass( 'selected' ) )) {
			// Check if the card is already selected.
			clickedCard.addClass( 'selected' );
			var clickId = clickedCard.attr( 'id' );
			var clickSymbolClass = memoryGame.gameMatrix[ clickId ];	
			var innerSymbol = clickedCard.find( 'a' );
			//Add a class corelated with the card ID 
			innerSymbol.addClass( clickSymbolClass );
			//Add ID to an array of selected IDs
			memoryGame.cardsSelected.push( clickId );
			//Cheeting :)
			memoryGame.showMatchingCards(clickSymbolClass);
			//Start function checking if the cards match
			memoryGame.checkThePair();
		} else {
			// Let user know that the card is already selected
			var innerSymbol = clickedCard.find( 'a' );
			innerSymbol.addClass( 'nonono' );
			memoryGame.updateTip( "You already selected this card!" );
			setTimeout(function() {
					innerSymbol.removeClass( 'nonono' );
				}, 200);
			};
	},

	/** 
	*  @Name: Oracle :) 
	* @description: After users choice, this one will show all the matching cards for the initial one.
    * @param: It takes the symbol from the clicked card as a base for the search of other, same cards.
    * To see it in action, please uncomment its code
    */
	showMatchingCards : function( clickSymbolClass ) {
	      //TODO: Comment it out before releasing.
	      var lists = $( '.memory_card_iteration' );
			lists.each( function() {
			var thisCardId = $( this ).attr( 'id' );
			var thisSymbolClass = memoryGame.gameMatrix[ thisCardId ];
			if ( thisSymbolClass == clickSymbolClass) {
				$(this).addClass( 'matching_cards' );
			};
		}); 
	},

	/** 
	* @description: Checks if the symbols of all the cards that are selected contain the same symbol. The matching process is performed for each element of an array 
	  that contains a certain amount of selected cards IDs. If anytime, the symbol is not matching the symbol of the first selected card - the array is being emptied, and implications are being proceeded.  
	* It uses several variables to perform the task by matching IDs with proper symbols through calling names and values from the dictionary that was created at the beginning of the game.
    */
	checkThePair : function() {
		var cardsToMatch = memoryGame.cardsSelected.length ;
		if ( cardsToMatch > 1 ) {
			// Will start only if the card selected is not the first one.
            // Assigning the symbol from the first card.
			var matchingSymbolId = memoryGame.cardsSelected[ 0 ];
			var matchingSymbolClass = memoryGame.gameMatrix[ matchingSymbolId ];

			for (idIndex in memoryGame.cardsSelected) {
				// Looping through the array of selected card Ids
				var nextMatchingidIndex = memoryGame.cardsSelected[ idIndex ] ; 
				// Assigning the next symbol to compare.
				var nextMatchingSymbolClass = memoryGame.gameMatrix[ nextMatchingidIndex ];

				if ( matchingSymbolClass != nextMatchingSymbolClass ) {
					//Matching if the symbols differ. 
					memoryGame.pairingFailed();
					return;
				} else {
					// Passing the game state for verification of next element.
				};
			};
			if ( cardsToMatch == memoryGame.cardsPairLength ) {  
				// Matching if the amount of the same symbol ids in the selected cards array is equal to the total number of the cards with the same symbol (in that game/difficulty).
				// Starts implication for matched cards.
				memoryGame.thePairMatched();
				} else {
				// Updates user with an info and allows for selecting another card.
				memoryGame.updateTip( "Almost there! Keep on picking!" );
				};
		} else {
		  // console.log( "Wow, welcome card, you'r the first one!" );
		};
	},

	/** 
	* @description: Function clears the selected cards array and removes selection classes from all involved elements. Also, adds +1 to move elements (stats). 
	* @param: constant number
	*/
	pairingFailed : function() {
		memoryGame.updateStats( -1 );
		// console.log("the pair failed in:" + memoryGame.cardsSelected );
		memoryGame.cardsSelected.forEach( function( content ){
			// console.log("removing selected class from" + content ); 
			var thisCard = $( "#" + content );
			thisCard.removeClass('selected');
			var thisInnerSymbolClass = memoryGame.gameMatrix[ content ];
			var innerSymbol = thisCard.find( 'a' );
			innerSymbol.addClass( 'nonono' );
			memoryGame.updateTip( "This are not a matching cards!" );
			// innerSymbol.fadeOut( 300 ); TODO - protection agains fast clicking
			setTimeout(function() {
				// Delay the removal of the classes so the animation could perform nicely. 
			 	innerSymbol.removeClass( 'nonono' );
			 	innerSymbol.removeClass( thisInnerSymbolClass );
			 	// innerSymbol.fadeOut( 300 );  TODO - protection agains fast clicking
				}, memoryGame.hideCardsDelay );
		});
		memoryGame.cardsSelected = [] ;
	},
	
	/** 
	* @description: 
	* @param: 
	*/
	thePairMatched : function() {
		// console.log( "The Pair Matched" );
		memoryGame.updateTip( "Awesome, you found it!" );
		memoryGame.updateStats( 1 );
		memoryGame.pairsRevealed += 1;
		// console.log( "memoryGame.pairsRevealed " + memoryGame.pairsRevealed );
		memoryGame.cardsSelected.forEach( function( content ){
			// console.log("removing selected class from" + content ); 
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
		// console.log( memoryGame.cardsSelected );
		memoryGame.checkIfGameWon();

	},

	/** 
	* @description: 
	* @param: 
	*/
	checkIfGameWon : function() {
		// console.log( memoryGame.pairsRevealed );
		if ( memoryGame.pairsRevealed < memoryGame.gameCardsIteration/memoryGame.cardsPairLength ){
			//console.log( " continue searching " );
		} else {
			// memoryGame.updateTip( );
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

	/** 
	* @description: Updates the HTML display with a given message
	* @param: Message to pass to DOM element
	*/
	updateTip : function( message ) {
		// var tip = $( '#tip' );
		memoryGame.tipContainer.show();
		memoryGame.tipContainer.empty();
		memoryGame.tipContainer.text( message );
		setTimeout( function() {
			memoryGame.tipContainer.fadeOut( 800 );
   			}, 999 );
	},

	/** 
	* @description: Function updates the game state variable and user interface with a new values for moves. */
	updateMoves : function() {
		memoryGame.moves += 1 ;
		memoryGame.movesContainer.empty();
		memoryGame.movesContainer.text( 'Moves: ' + memoryGame.moves );
		// console.log("Moves updated to" + memoryGame.moves );
	},

	/** 
    * @description: Updates the game state variable and user interface with new values for points. I t also triggers a step for updating the game moves.
    * @param: As point can go up and down, there is a vector input to add 1 or -1 to the points value.
    * TODO: Initially there was some idea for points, as for now, they are not necessary at all.
    */
	updateStats : function( vector ) {		
		memoryGame.points += vector ;
		var pointsContainer = $( '#points' );
		memoryGame.pointsContainer.empty();
		memoryGame.pointsContainer.text( "Points: " + memoryGame.points );	
		// console.log("Points updated to" + memoryGame.points );
		memoryGame.updateMoves();
	},

	/** 
	* @description: Because there are backgrounds only in informative parts of the game - this switches the background on or off.
	* TODO: Add nicer animation on revealing. Check the Chrome problems.
	*/
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

	/** 
    * @description: Constructs proper sentence to be displayed in the final game screen. Also, changes the game state to the final one, and starts the winner stars animation. 
    * @param: memoryGame object variables - points and moves.
    * TODO: Fine tune the timings for the different game difficulties.
    */
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
	
	/** 
	@description: Sets the proper amount of stars displayed as a gold star at the game results screen.
    * @param: Takes the amount of cards (dependent on the difficulty) of the game and the final states of memoryGame results variables. 
    * TODO: Quality of the result measuring needs equalisation based on the user's results. Will require the creation of Game results board to keep game results records.
    */
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
		$( '.stars' ).each( function( i ) {
			//Changes class for each star as long as the proper amount of stars shines.
			if ( i < starIndex) {
				var innerSymbol = $( this );
					innerSymbol.removeClass( 'stars-gold' );	
					setTimeout( function() {
						// Sets a brak before the user sees the animations.
						innerSymbol.addClass( 'stars-gold' );
    				}, i * 633); 
				};
			});
	},


	/** 
	* @description: Resets the initial values of memoryGame variables and cleans HTML containers.
	*/
	resetData : function() {
		// memoryGame variables
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
		// emptying containers
		memoryGame.updateTip( '' );
		memoryGame.pointsContainer.empty();
		memoryGame.pointsContainer.text( "Points: " + memoryGame.points );
		memoryGame.movesContainer.empty();
		memoryGame.movesContainer.text( "Moves: " + memoryGame.moves );
		memoryGame.gameBoardElement.empty();
		var targetBoard = $( '.game_child_container' ).attr( 'class' , 'game_child_container' );
	},

};
