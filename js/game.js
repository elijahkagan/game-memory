$( document ).ready( function() {
	console.log( "Starting The Game!" );
	
	//helpers
	// memoryGame.scrA.hide();
	// memoryGame.moves = 8 ;
	// memoryGame.points = 8 ;
	// memoryGame.gameCardsIteration = 16 ;
	// memoryGame.updateFinalResults();
	// memoryGame.switchGameView( memoryGame.scrB , memoryGame.scrC , 0 );

	//Animation
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
  	};

	function abortTimer() { // to be called when you want to stop the timer
  		clearInterval( wave );
	};

	//Choose difficulty
	$('.difficulty_button').click(function() {
		var dataDiff = String( $( this ).attr( 'difficulty' ));
		//console.log( "Difficulty level set to: " + dataDiff + "!" );
		difficultyChoice =  memoryGame.difficulty[ dataDiff ];
		memoryGame.gameBoard( difficultyChoice );
		clearInterval( wave );
	});
	
	//Play again
	$('.play_again').click(function() {
		memoryGame.resetData();
		memoryGame.switchGameView( memoryGame.scrC , memoryGame.scrA , 1 );
	});
	$('.reset_game').click(function() {
		memoryGame.switchGameView( memoryGame.scrB , memoryGame.scrA , 1 );
		setTimeout( memoryGame.resetData(), 40 );
	});
	//Pick a card
	$('#game_board').on('click','.memory_card_iteration', function() {
				var clickedCard = $( this );
				memoryGame.selectTheCard( clickedCard );
	});

	// TODO - start again in the middle of the game.
});
