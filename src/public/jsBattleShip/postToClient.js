let table_1 = document.getElementById("table_1");
let table_2 = document.getElementById("table_2");
let tds1 = table_1.getElementsByTagName("td");
let tds2 = table_2.getElementsByTagName("td");
let answerToServer = document.getElementById("answerToServer");
let clientText = document.getElementById("clientText");
let counterShip = 0;
let xhr = new XMLHttpRequest();

let data = {
    userName: "",
    usersShip: new Array(),
    shotShip: "",
};

let arrShipTable1 = new Array();
let arrShipTable2 = new Array();
for (let i = 0; i < tds1.length; i++) {
    arrShipTable1.push(tds1[i].id);
}
for (let i = 0; i < tds2.length; i++) {
    arrShipTable2.push(tds2[i].id);
}

function startGame() {
    xhr.open('GET', 'startGame', false);
    xhr.send();
    switch (xhr.responseText) {
        case "You name: ":
            answerToServer.value = "You name: ";
            break;
        case "error":
            answerToServer.value = "error";
            break;
    }
};

function ok() {
    if (answerToServer.value === "You name: ") {
        if (clientText.value === "") {
            alert("pls print you name")
            return;
        } else {
            data.userName = clientText.value;
            xhr.open('GET', 'nameUser?data=' + JSON.stringify(data), false);
            xhr.send();
            if (xhr.responseText === "Arrange your ships! Click ok") {
                answerToServer.value = xhr.responseText;
                table_1.style.pointerEvents = "visible";
                clientText.value = counterShip + "/5";
            }
        }
    }
    if (answerToServer.value === "Arrange your ships! Click ok" && clientText.value === "5/5") {
        xhr.open('GET', 'playGame?data=' + JSON.stringify(data), false);
        xhr.send();
        console.log(xhr.responseText + " - game.usersShip");
        answerToServer.value = xhr.responseText;
        table_2.style.pointerEvents = "visible";
        if (answerToServer.value === "wait player 2" || answerToServer.value === "wait move player 1") {
            p1();
        }
    }
};

function p1() {
    let wait = setInterval(function () {
        xhr.open('GET', 'api-updata?data=' + JSON.stringify(data), false);
        xhr.send();
        answerToServer.value = xhr.responseText;
        if (xhr.responseText === "WON!!!") {
            alert(" WON !!! ");
            clearInterval(wait);
            location.reload();
        }
        if (xhr.responseText === "Lose!!!") {
            alert(" Lose !!! ");
            clearInterval(wait);
            xhr.open('GET', 'resetServer', false);
            xhr.send();
            answerToServer.value = xhr.responseText;
            location.reload();
        }
        else {
            if (xhr.responseText === "wait" || xhr.responseText === "shot") {}
            else {
                if (xhr.responseText === "") {}
                else {
                    let newID = arrShipTable1[xhr.responseText];
                    if ( newID === undefined ){
                    }else {
                        if (document.getElementById(newID).style.backgroundColor === 'rgb(255, 77, 77)' || document.getElementById(newID).style.backgroundColor === "rgb(102, 0, 0)") {
                            document.getElementById(newID).style.backgroundColor = "rgb(102, 0, 0)";
                        }
                        else {
                            document.getElementById(newID).style.backgroundColor = "rgb(153, 255, 255)";
                        }
                    }
                }
            }
        }
    }, 10);
}

function clickTable1() {
    let target = event.target;
    let id = target.id;
    if (id === "Mship1" || id === "Mship2" || id === "Mship3" || id === "Mship4" || id === "Mship5" ||
        id === "Mship6" || id === "Mship7" || id === "Mship8" || id === "Mship9" || id === "Mship10" ||
        id === "Mship11" || id === "Mship12" || id === "Mship13" || id === "Mship14" || id === "Mship15" ||
        id === "Mship16" || id === "Mship17" || id === "Mship18" || id === "Mship19" || id === "Mship20" ||
        id === "Mship21" || id === "Mship22" || id === "Mship23" || id === "Mship24" || id === "Mship25") {
        if (counterShip < 5) {
            if (document.getElementById(id).style.backgroundColor === "rgb(255, 77, 77)") {
                return;
            }
            counterShip++;
            clientText.value = counterShip + "/5";
            document.getElementById(id).style.backgroundColor = "rgb(255, 77, 77)";

            for (let i = 0; i < arrShipTable1.length; i++) {
                if (arrShipTable1[i] === id + "") {
                    let index = arrShipTable1.indexOf(id + "");
                    data.usersShip.push(index);
                }
            }
        }
    }
}

function clickTable2() {
    let target = event.target;
    let id = target.id;
    let index;
    if (id === "ship1" || id === "ship2" || id === "ship3" || id === "ship4" || id === "ship5" ||
        id === "ship6" || id === "ship7" || id === "ship8" || id === "ship9" || id === "ship10" ||
        id === "ship11" || id === "ship12" || id === "ship13" || id === "ship14" || id === "ship15" ||
        id === "ship16" || id === "ship17" || id === "ship18" || id === "ship19" || id === "ship20" ||
        id === "ship21" || id === "ship22" || id === "ship23" || id === "ship24" || id === "ship25") {
        data.shotShip = id + "";
        for (let i = 0; i < arrShipTable2.length; i++) {
            if (arrShipTable2[i] === id + "") {
                index = arrShipTable2.indexOf(id + "");
                console.log(index + " - index2");
                data.shotShip = index;
            }
        }
        xhr.open('GET', 'shot?data=' + JSON.stringify(data), false);
        xhr.send();
        if (xhr.responseText === "shot ok") {
            document.getElementById(id).style.backgroundColor = "rgb(153, 255, 153)";
        }
        else if (xhr.responseText === "wait") {
            answerToServer.value = "wait";
        }
        else if (xhr.responseText === "") {
            document.getElementById(id).style.backgroundColor = "rgb(153, 255, 255)";

        }
    }
}

function resset() {
    location.reload();
    xhr.open('GET', 'resetServer', false);
    xhr.send();
}