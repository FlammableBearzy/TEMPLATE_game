const express = require('express');
const router = express.Router();
const Play = require("../models/playsModel");
const auth = require("../middleware/auth");


router.patch('/endturn', auth.verifyAuth, async function (req, res, next) {
    try {
        console.log("Play End Turn");
        if (!req.game) {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else {
            let result = await Play.endTurn(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
//drawing a card can be considered more than "get"ing a card
router.post('/draw', auth.verifyAuth, async function (req, res, next){
    try {
        console.log("Draw Cards");
        if (!req.game)
        {
            res.status(400).send({msg:"You are not at a game, please create or join a game"});
        } else if (req.game.opponents.lenght == 0)
        {
            res.status(400).send({msg:"Your game has not started yet."});
        } else {
            let result = await Play.drawCard(req.game);
            res.status(result.status).send(result.result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;