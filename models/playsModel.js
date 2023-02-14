const pool = require("../config/database");

class Play {
    // At this moment I do not need to store information so we have no constructor

    // This considers that only one player plays at each moment, 
    // so ending my turn starts the other players turn
    // We consider the following verifications were already made:
    // - The user is authenticated
    // - The user has a game running
    // NOTE: This might be the place to check for victory, but it depends on the game
    static async endTurn(game) {
        try {
            // Do not need to check if there two players since in that case
            // the player will not be on Playing state
            if (game.player.state.name != "Playing") {
                return {status: 400, result:{msg: 
                    "You cannot end turn since you are not currently on your turn"}}
            }

            // Change player state to waiting (1)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [1,game.player.id]); 
            // Change opponent state to playing (2)
            await pool.query(`Update user_game set ug_state_id=? where ug_id = ?`,
                [2,game.opponents[0].id]);
            // Increase the number of turns.
            // NOTE: With the information we have we need to increase the turn
            // each time a player ends. If you want the client to see only a changed
            // turn when both players play you can change the export of the Game class:
            // Change "game.turn = this.turn;" to "game.turn = Math.ceil(this.turn/2);" 
            await pool.query(`Update game set gm_turn=gm_turn+1 where gm_id = ?`,
                [game.id]);
                 
        
            return {status:200, result: {msg: "Your turn ended."}};
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        } 
    }
}

module.exports = Play;