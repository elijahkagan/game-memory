$( document ).ready( function game() {
	//console.log( "Starting the game" );
	
	//Choose difficulty
	$('.difficulty_button').click(function() {
		var dataDiff = String( $( this ).attr( 'difficulty' ));
		//console.log( "Difficulty level: " + dataDiff + "!" );
		difficultyChoice =  memoryGame.difficulty[ dataDiff ];
		memoryGame.gameBoard( difficultyChoice );
	});
	
	//Play again
	$('.play_again').click(function() {
		memoryGame.resetData();
		console.log( "Starting the game again - awesome") ;
	});

	//Pick a card
	$('#game_board').on('click','.memory_card_iteration', function() {
				var clickedCard = $( this );
				memoryGame.selectTheCard( clickedCard );
	});

	// TODO - start again in the middle of the game.
});
