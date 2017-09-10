/** @description: Starts the game when the document finishes loading. */
$( document ).ready( function() {
	console.log( "Starting The Game!" ); 

	/** 
	* @description: Adds transformation to interface elements in looped style through repeating some actions in an interval.
    * @constructor: Implemented as a variable for further reuse. 
    * @param: each item from the collection is being processed by nested sequence so as a parameter we use the index of the element, the element itself and time. 
    * @returns: wave effect on the letters of the logo. 
    * TODO: more complex and funny interaction with the letters.
	*/
	var wave = setInterval( waveTheMemory , 6000 );
	function waveTheMemory() {
  		$( '.big_letter' ).each( function( i , el ) {
  			var bigLetter = el ;
			setTimeout( function() {
				bigLetter.classList.add( 'waved' );
				setTimeout( function() {
					bigLetter.classList.remove( 'waved' );	
					}, ( i * 50 ) + 50 );
			}, i * 50 );
			});
  	}


	/** 
	* @description: Function stops the time flow for the interval based animation.
	* @constructor: 
	* @param: Interval object. 
	*/
	function abortTimer() { 
  		clearInterval( wave );
	}


	/** 
	* @name: Difficulty choice.
    * @description: Action handler for the buttons that set up different game modes called: difficulties. Starts processing of game elements. Stops animation of the logo. 
    * @param: User choice.
	*/
	$('.difficulty_button').click(function() {
		var dataDiff = String( $( this ).attr( 'data-difficulty' ));
		//console.log( "Difficulty level set to: " + dataDiff + "!" );
		difficultyChoice =  memoryGame.difficulty[ dataDiff ];
		memoryGame.gameBoard( difficultyChoice );
		clearInterval( wave );
	});
	

	/** 
	* @name: Pick a card - the centre of the experience. 
    * @description: Catches the selected card object and passes it as a parameter to the game engine by the call of the memoryGame object.
    * @param: User choice / clicked element.
	*/
	$('#game_board').on('click','.memory_card_iteration', function() {
				var clickedCard = $( this );
				memoryGame.selectTheCard( clickedCard );
	});


	/** 
	* @description: Resets the game and brings the user to the Welcome screen. Starts wave animation Interval 
    * @param: User choice.
	*/
	$('.reset_game').click(function() {
		memoryGame.switchGameView( memoryGame.scrB , memoryGame.scrA , 1 );
		setTimeout( memoryGame.resetData(), 40 );
		wave = setInterval( waveTheMemory , 6000 );
	});


	/** 
	* @description: Allows the player to start the game again by resetting the display to the Welcome screen. Starts the wave animation Interval 
    * @param: User choice.
    */
	$('.play_again_button').click(function() {
		memoryGame.resetData();
		memoryGame.switchGameView( memoryGame.scrC , memoryGame.scrA , 1 );
		wave = setInterval( waveTheMemory , 6000 );
	});
});
