-- Translating from MySQL to Postgre.

-- DROP TABLE IF EXISTS user_player CASCADE;
-- DROP TABLE IF EXISTS game_state CASCADE;
-- DROP TABLE IF EXISTS user_game_state CASCADE;
-- DROP TABLE IF EXISTS game CASCADE;
-- DROP TABLE IF EXISTS user_game CASCADE;
-- DROP TABLE IF EXISTS card CASCADE;
-- DROP TABLE IF EXISTS user_game_card CASCADE;

CREATE TABLE user_player (
    usr_id SERIAL PRIMARY KEY,
    usr_name varchar(60) NOT NULL,
    usr_pass varchar(200) NOT NULL, 
    usr_token varchar(200)
);
CREATE TABLE game_state (
    gst_id SERIAL PRIMARY KEY,
    gst_state varchar(60) NOT NULL
);

CREATE TABLE user_game_state (
    ugst_id SERIAL PRIMARY KEY,
    ugst_state varchar(60) NOT NULL
);

CREATE TABLE game (
    gm_id SERIAL PRIMARY KEY,
    gm_turn int NOT NULL DEFAULT 1,
    gm_state_id int NOT NULL --REFERENCES game_state(gst_id)
);

CREATE TABLE user_game (
    ug_id SERIAL PRIMARY KEY,
    ug_user_id int NOT NULL, --REFERENCES user_player(usr_id),
    ug_game_id int NOT NULL, --REFERENCES game(gm_id),
    ug_state_id int NOT NULL, --REFERENCES user_game_state(ugst_id)
	ug_damage int DEFAULT 0,
	ug_draw boolean DEFAULT FALSE
);

CREATE TABLE card(
	crd_id SERIAL PRIMARY KEY,
	crd_name varchar(60) NOT NULL,
	crd_attack int NOT NULL,
	crd_health int NOT NULL
);

CREATE TABLE user_game_card(
	ugc_id SERIAL PRIMARY KEY,
	ugc_ug_id int NOT NULL,
	ugc_crd_id int NOT NULL,
	ugc_current_health int NOT NULL,
	ugc_was_used boolean NOT NULL
);

-- Foreign Keys

ALTER TABLE game ADD CONSTRAINT game_fk_match_state
    FOREIGN KEY (gm_state_id) REFERENCES game_state(gst_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE user_game ADD CONSTRAINT user_game_fk_user
    FOREIGN KEY (ug_user_id) REFERENCES user_player(usr_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE user_game ADD CONSTRAINT user_game_fk_game
    FOREIGN KEY (ug_game_id) REFERENCES game(gm_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE user_game ADD CONSTRAINT user_game_fk_user_game_state
    FOREIGN KEY (ug_state_id) REFERENCES user_game_state(ugst_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;
	
ALTER TABLE user_game_card ADD CONSTRAINT ugc_fk_ug
    FOREIGN KEY (ugc_ug_id) REFERENCES user_game(ug_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;
	
ALTER TABLE user_game_card ADD CONSTRAINT ugc_fk_card
    FOREIGN KEY (ugc_crd_id) REFERENCES card(crd_id) 
    ON DELETE NO ACTION ON UPDATE NO ACTION;