const bcrypt = require('bcrypt');
const pool = require("../config/database");
const auth = require("../config/utils");
const saltRounds = 10; 

class User {
    constructor(id, name, pass, token) {
        this.id = id;
        this.name = name;
        this.pass = pass;
        this.token = token;
    }

    static async getById(id) {
        try {
            let dbres = await pool.query("Select * from user_player where usr_id = $1", [id]);
            let dbUsers = dbres.rows;
            if (!dbUsers.length) 
                return { status: 404, result:{msg: "No user found for that id."} } ;
            let dbUser = dbUsers[0];
            return { status: 200, result: 
                new User(dbUser.id,dbUser.usr_name,dbUser.usr_pass, dbUser.usr_token)} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }  
    }

    static async register(user) {
        try {
            let dbres = await pool.query("Select * from user_player where usr_name = $1", [user.name]);
            let dbUsers = dbres.rows;
            if (dbUsers.length)
                return {
                    status: 400, result: [{
                        location: "body", param: "name",
                        msg: "That name already exists"
                    }]
                };
            let encpass = await bcrypt.hash(user.pass,saltRounds);   
            let result = await pool.query(`Insert into user_player (usr_name, usr_pass) values ($1, $2)`, [user.name, encpass]);
            return { status: 200, result: {msg:"Registered! You can now log in."}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
 

    static async checkLogin(user) {
        try {
            let dbres = await pool.query("Select * from user_player where usr_name = $1", [user.name]);
            let dbUsers = dbres.rows;
            if (!dbUsers.length)
                return { status: 401, result: { msg: "Wrong username or password!"}};
            let dbUser = dbUsers[0]; 
            let isPass = await bcrypt.compare(user.pass,dbUser.usr_pass);
            if (!isPass) 
                return { status: 401, result: { msg: "Wrong username or password!"}};
            user.id = dbUser.usr_id;
            return { status: 200, result: user } ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    // No verifications. Only to use internally
    static async saveToken(user) {
        try {
            let dbres = await pool.query(`Update user_player set usr_token = $1 where usr_id = $2`,[user.token ,user.id]);
            return { status: 200, result: {msg:"Token saved!"}} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    static async getUserByToken(token) {
        try {
            let dbres = await pool.query(`Select * from user_player where usr_token = $1`,[token]);
            let dbUserToken = dbres.rows;
            if (!dbUserToken.length)
                return { status: 403, result: {msg:"Invalid authentication!"}} ;
            let user = new User();
            user.id = dbUserToken[0].usr_id;
            user.name = dbUserToken[0].usr_name;
            return { status: 200, result: user} ;
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = User;