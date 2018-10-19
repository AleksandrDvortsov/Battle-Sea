class BattleShip {
    constructor() {
        this.arrPlayer1Ship = [];
        this.arrPlayer2Ship = [];
        this.player1 = true;
        this.Player2 = false;
        this.commandP1 = "";
        this.commandP2 = "";
    }
};

let countShipP1 = 0;
let countShipP2 = 0;

const express = require("express");
const nunjucks = require("nunjucks");
const fileUpload = require('express-fileupload');

const app = express();
app.listen(9777);

app.use("/public", express.static("public"));
app.use(fileUpload());
// app.use("/views/IMG",express.static("IMG"));

nunjucks.configure("views", {
    autoescape: true,
    noCache: true,
    express: app,
});

//////////////////////////////////    S   H   I   P   //////////////////////////////////////////

let arrUserName = new Array();
let battleShip;

app.get("/battle.html", function (reg, res) {
    return res.render('battle.html', {});
});

app.get("/startGame", function (reg, res) {
    res.send("You name: ");
});
app.get("/nameUser", function (reg, res) {
    let nameUser = JSON.parse(reg.query.data);
    arrUserName.push(nameUser.userName);
    res.send("Arrange your ships! Click ok");
});
app.get("/playGame", function (reg, res) {
    if (battleShip === undefined) {
        battleShip = new BattleShip();
        battleShip.arrPlayer1Ship = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        console.log(battleShip.arrPlayer1Ship.length);

        let game = JSON.parse(reg.query.data);
        for (let i = 0; i < game.usersShip.length; i++) {
            let index = game.usersShip[i];
            for (let j = 0; j < battleShip.arrPlayer1Ship.length; j++) {
                battleShip.arrPlayer1Ship[index] = 1;
            }
        }
        battleShip.commandP1 = "wait player 2";
        res.send("wait player 2");
    }
    else {
        battleShip.arrPlayer2Ship = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let game = JSON.parse(reg.query.data);
        for (let i = 0; i < game.usersShip.length; i++) {
            let index = game.usersShip[i];
            for (let j = 0; j < battleShip.arrPlayer2Ship.length; j++) {
                battleShip.arrPlayer2Ship[index] = 1;
            }
        }
        battleShip.commandP1 = "shot";
        battleShip.commandP2 = "wait move player 1";
        res.send("wait move player 1");
    }
});
app.get("/api-updata", function (reg, res) {
    let data = JSON.parse(reg.query.data);
    if (data.userName === arrUserName[0]) {
        if (countShipP1 === 5) {
            battleShip.commandP1 = "WON!!!";
            battleShip.commandP2 = "Lose!!!";
            return res.send(battleShip.commandP1);
        }
        res.send(battleShip.commandP1);
    }
    else {
        if (countShipP2 === 5) {
            battleShip.commandP2 = "WON!!!";
            battleShip.commandP1 = "Lose!!!";
            return res.send(battleShip.commandP2);
        }
        res.send(battleShip.commandP2);
    }

});
app.get("/shot", function (reg, res) {
    let shotShip = JSON.parse(reg.query.data);
    if (arrUserName[0] === shotShip.userName) {
        if (battleShip.player1 === true) {
            for (let i = 0; i < battleShip.arrPlayer2Ship.length; i++) {
                if (battleShip.arrPlayer2Ship[shotShip.shotShip] === 1) {
                    countShipP1++;
                    battleShip.commandP2 = shotShip.shotShip +"";
                    return res.send("shot ok");
                }
                else {
                    battleShip.commandP2 = shotShip.shotShip +"";
                    battleShip.player2 = true;
                    battleShip.player1 = false;
                    battleShip.commandP1 = "wait";
                    // battleShip.commandP2 = "shot";
                    return res.send("");
                }
            }
        }
    }
    if (arrUserName[1] === shotShip.userName) {
        if (battleShip.player2 === true) {
            for (let i = 0; i < battleShip.arrPlayer1Ship.length; i++) {
                if (battleShip.arrPlayer1Ship[shotShip.shotShip] === 1) {
                    countShipP2++;
                    battleShip.commandP1 = shotShip.shotShip +"";
                    return res.send("shot ok");
                }
                else {
                    battleShip.commandP1 = shotShip.shotShip +"";
                    battleShip.player2 = false;
                    battleShip.player1 = true;
                    // battleShip.commandP1 = "shot";
                    battleShip.commandP2 = "wait";
                    return res.send("");
                }
            }
        }
    }
    return res.send("wait")
});
app.get("/resetServer", function (reg, res) {
    console.log("reset server )");
    res.send("reset server )");
    arrUserName = new Array();
    battleShip = undefined;

    countShipP1 = 0;
    countShipP2 = 0;
});







