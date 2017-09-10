/** @description: Starts th game when document is loaded. */
$( document ).ready( function() {
	console.log( "Starting The Game!" ); 

	/** 
	* @description: Adds transformation to interface elements in looped style throuh repeting some actions in interval.
	* @constructor: implemented as a variable so it could easily be reused.
	* @param: each elelmet from the collection is being processed by nested sequence so as a parameters we use the index of the elelement, element itself and time. 
	* @returns: a nice, visual wave on the letters of the logo. 
	* TODO: more complex and funny interaction with letter.
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
	* @description: Stops the time flow for the interval based animation.
	* @constructor: 
	* @param: Interval name. 
	*/
	function abortTimer() { 
  		clearInterval( wave );
	}


	/** 
	* @name: Choice of difficulty
	* @description: Action handler for the buttons that set up different game modes called: dificulties. Starts proces of game elements. Stops animation of the logo. 
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
	* @name: Pick a card - the center of expirience. 
	* @description: Catches the picked card object and passes it as a parameter to the game engine by the call of the memoryGame object.
	* @param: User choice / clicked element.
	*/
	$('#game_board').on('click','.memory_card_iteration', function() {
				var clickedCard = $( this );
				memoryGame.selectTheCard( clickedCard );
	});


	/** 
	* @description: Resets the game and brings user to the Welcome screen. Starts wave animation Interval 
	* @param: User choice.
	*/
	$('.reset_game').click(function() {
		memoryGame.switchGameView( memoryGame.scrB , memoryGame.scrA , 1 );
		setTimeout( memoryGame.resetData(), 40 );
		wave = setInterval( waveTheMemory , 6000 );
	});


	/** 
	* @description: Allows player to start the game again by reseting the display to the Welcome screen. Starts wave animation Interval 
	* @param: User choice.
	*/
	$('.play_again_button').click(function() {
		memoryGame.resetData();
		memoryGame.switchGameView( memoryGame.scrC , memoryGame.scrA , 1 );
		wave = setInterval( waveTheMemory , 6000 );
	});
});
