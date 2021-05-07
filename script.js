//database 
let db;

class AudioController {
    constructor() {
        this.waveMusic = new Audio('Accets/Audio/Waves-sound-effect.mp3');
        this.flipSound = new Audio('Accets/Audio/flip.wav');
        this.matchSound = new Audio('Accets/Audio/match.wav');
        this.winMusic = new Audio('Accets/Audio/Ta Da.wav');
        this.gameOverSound = new Audio('Accets/Audio/gameOver.wav');
        this.waveMusic.volume = 0.2;
        this.waveMusic.loop = true;
    }
    startMusic() {
        this.waveMusic.play();
    }

    stopMusic() {
        this.waveMusic.pause();
        this.waveMusic.currentTime = 0;
    }

    flip() {
        this.flipSound.play();
    }

    match() {
        this.matchSound.play();
    }

    victoryMusic() {
        this.stopMusic();
        this.winMusic.play();

    }

    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();

    }
    getMusic() {
        return this.waveMusic;
    }
}

class underTheSea {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.isPlayer1 = Data.whosTurn;
        this.namePlayer = document.getElementById("namePlayer");
        this.putScore = document.getElementById("scores");
        this.timer = document.getElementById('timer');
        this.winText = document.getElementById('winner');
        this.audioController = new AudioController();
        this.audioController.startMusic();
        this.score1 = 0;
        this.score2 = 0;
        this.ArrayValues;
    }

    whosTurn() {
        if (this.isPlayer1)
            this.namePlayer.innerHTML = player1;
        else
            this.namePlayer.innerHTML = player2;
        this.showScores();
    }

    whosScores() {
        setTimeout(() => {
            if (this.isPlayer1) {
                this.score1++;

            } else {
                this.score2++;

            }
        }, 100)

    }

    showScores() {
        setTimeout(() => {
            if (this.isPlayer1)
                this.putScore.innerHTML = this.score1+Data.player1_score;
            else
                this.putScore.innerHTML = this.score2+Data.player2_score;
        }, 100);

    }



    manageTurns() {
        if (this.isPlayer1 == 0){
            this.isPlayer1 = 1 - this.isPlayer1;
            Data.whosTurn = this.isPlayer1;
        }else{
            this.isPlayer1 = 1 - this.isPlayer1;
             Data.whosTurn = this.isPlayer1;
        }
    }


   updateCardsValue(cardsArray){
        var j = cardsArray.length-1;
        var i = cardsArray.length-1;
        this.cardsValue = cardsArray.map(c=>{return {id:cardsArray[j--].id,order:cardsArray[i--].style.order,isVisible:false,isMatch:false} });
    
        Data.cardsArray= this.cardsValue;
        console.log(this.cardsValue);
    
   }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        //if shuffle needed or the array exist in database.
        setTimeout(() => {
            this.audioController.startMusic();
            if(Data.shuffleIsNeeded){
            this.shuffleCards(this.cardsArray,this.cardsValue,this.tempMap);
            }else{
                this.shuffleAccordingFirstPlayer(this.cardsArray);
            }
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.whosTurn();
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    setCard(cards) {
        this.cardsArray = cards;
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
        var restart = document.getElementsByClassName('restart1').item(0);
        this.restart(document.getElementById('game-over-text'), restart);
    }

    restart(overleys, restart) {
        restart.addEventListener('click', () => {
            insertName();
            insertCards();
            overleys.classList.forEach(overlay => {
                overleys.classList.remove('visible');
            });

            Game.player1_score = this.score1;
            Game.player2_score = this.score2;


            isFirst = false;
            this.hideCards();
            this.cleanFiealds();
            document.getElementById('firstScreen').classList.add('visible');
            ready();
        })
    }

    victory() {
        if (Data.player1_score > Data.player2_score){
            this.winText.innerHTML = player1 + " win!"
        }else if(Data.player1_score  == Data.player2_score){
            this.winText.innerHTML = "tie!"
        } else{
                this.winText.innerHTML = player2 + " win!"
            }

        clearInterval(this.countdown);
        this.audioController.victoryMusic();
        document.getElementById('victory-text').classList.add('visible');
        this.restart(document.getElementById('victory-text'), document.getElementsByClassName('restart2').item(0));

    }

    cleanFiealds(){

        Data.shuffleIsNeeded = true;
        //maybe need change
        Data.whosTurn = 0;
        Data.cardsArray = null;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }


    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            card.classList.add('visible');
            setTimeout(() => {

            this.updateFlipCard(card);
            },500);

            //visible value.
            if (this.cardToCheck) {
                this.checkForCardMatch(card);               
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
        this.showScores();
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        setTimeout(() => {
        updateDataatch(card1,card2);
        },500);
        this.audioController.match();
        this.whosScores();
        if (this.matchedCards.length === this.cardsArray.length) {
            this.showScores();
            this.victory();
        } else {
            this.busy = true;
            setTimeout(() => {
                this.showScores();
                this.busy = false;
            }, 500)
        }
    }

    updateDataatch(card1,card2){
        Data.cardsArray.forEach((card)=>{
            if(card["id"]  === card1.id){
               card["isMatch"]  = true;
            }else if(card["id"]  === card2.id){
                card["isMatch"] = true; 
            }
        });

        //fetch server
    }

    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.updateDataMistmatch(card1,card2);
            this.manageTurns();
            this.whosTurn();
            this.showScores();
            this.busy = false;
        }, 1000);
    }

    updateDataMistmatch(card1,card2){
        Data.cardsArray.forEach((card)=>{
            if(card["id"]  === card1.id){
                card["isVisible"] = false;
            }else if(card["id"]  === card2.id){
                card["isVisible"]  = false; 
            }
        });

        //fetch server with update field.
    }

    updateFlipCard(card1){

        Data.cardsArray.forEach((card)=>{
            console.log(card1.id +"id card");
            console.log(card["id"] +"id map" );
            if(card["id"] === card1.id){
                card["isVisible"]  = true;
            }
        });
        //fetch server.
    }

    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.

        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
            console.log(i);
        }
        Data.shuffleIsNeeded = false;
        this.updateCardsValue(cardsArray);
         //fetch to server for update 

    }

    shuffleAccordingFirstPlayer(cardsArray){
        var i = cardsArray.length-1;
        Data.cardsArray.forEach((card)=>{
            cardsArray[card["order"]].style.order = i;
            cardsArray[i] = card["order"];
        });

        //send fetch to server? maybe
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

//promise
let promise = new Promise((reslove, reject) => {
    //if their is no 2 players
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ready();
            reslove('Success');
        });

    } else {
        ready();
        reslove('Success')
    }
})

function insertName() {
    setTimeout(() => {
        document.getElementById("player1").value = Game.player1;
        document.getElementById("player2").value = Game.player2;
        const rbs = document.querySelectorAll('input[name = "level"]');
        for (const rb of rbs) {
            if (rb.value === Game.level) {
                rb.checked = true;
            }
        }
    }, 1000)
}

function insertCards() {
    var myobj1 = document.getElementById("sharkCrad1");
    var myobj2 = document.getElementById("sharkCrad2");
    var myobj3 = document.getElementById("jellyfishCrad1");
    var myobj4 = document.getElementById("jellyfishCrad2");
    myobj1.hidden = true;
    myobj2.hidden = true;
    myobj3.hidden = true;
    myobj4.hidden = true;

}


function clearFields() {
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
    const rbs = document.querySelectorAll('input[name = "level"]');
    for (const rb of rbs) {
        rb.checked = false;
    }
}

function ready() {

    initDb();

    if (isFirst) {
        cardsFirst = Array.from(document.getElementsByClassName('card'));
    }
    let start = document.getElementsByClassName('start').item(0);
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new underTheSea(100, cards);

    start.addEventListener('click', () => {
        player1 = document.getElementById("player1").value;
        player2 = document.getElementById("player2").value;
        Game.player1 = player1;
        Game.player2 = player2;
        const rbs = document.querySelectorAll('input[name = "level"]');
        for (const rb of rbs) {
            if (rb.checked) {
                radio = rb.value;
                break;
            }
        }

        Game.level = radio;
        saveToDB(Game);

        if (radio === '4X4') {

            var myobj1 = document.getElementById("sharkCrad1");
            var myobj2 = document.getElementById("sharkCrad2");
            var myobj3 = document.getElementById("jellyfishCrad1");
            var myobj4 = document.getElementById("jellyfishCrad2");
            myobj1.removeAttribute('hidden');
            myobj2.removeAttribute('hidden');
            myobj3.removeAttribute('hidden');
            myobj4.removeAttribute('hidden');
            let cards = Array.from(document.getElementsByClassName('card'));
            game.setCard(cards);
        } else {
            var valuetoUpdate = 16;
            let cardsNew = [];
            for (var i = 0; i < 16; i++) {
                if (!cards[i].hidden) {
                    cardsNew.push(cards[i]);
                }
            }
            console.log(cardsNew);
            game.setCard(cardsNew);
        }

        if (player1 != "" && player2 != "") {
            if (player1 == player2) {
                setNameForPlayer1(player1 + "1");
                setNameForPlayer2(player2 + "2");
            }
            if (radio != null) {
                overlays.forEach(overlay => {
                    overlay.classList.remove('visible');

                });
                let audioController = new AudioController();
                //  audioController.startMusic();
                game.startGame();
            } else {
                alert("Level must be chose");
            }
        } else {
            alert("Players can not be null!");
        }

    });
    clearFields();
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

function setNameForPlayer1(name) {
    console.log(name);
    player1 = name;
}

function setNameForPlayer2(name) {
    console.log(name);
    player2 = name;
}



function initDb() {
    db = openDatabase('gameDb', '1.0', 'gameDb', 2 * 1024 * 1024);
    const game = this.dataJson
    db.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS " +
            "Game(ID INTEGER PRIMARY KEY ASC, json_data TEXT)", []);

        // if (this.isclearTable) {
        //     console.log("table was cleared")
        //     tx.executeSql('DELETE FROM gamePlayer3')
        // }
        console.log("database was created !")
    })

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Game', [], (tx, results) => {
            if (results.rows.length === 0) {
                console.log("data was inserted")

                tx.executeSql('INSERT INTO Game (json_data) VALUES (?)', [game]);

            }
        })
    });


}

function saveToDB(json) {

    const json_string = JSON.stringify(json)
    if (!db)
        return


    db.transaction((tx) => {

        const query = 'UPDATE Game SET json_data=\'' + json_string + '\' WHERE ID="1"'
        tx.executeSql(query, [], () => {}, errCallback);


        tx.executeSql('SELECT * FROM Game', [], (tx, results) => {
            json = JSON.parse(results.rows[0].json_data)
            console.log("data was selected: ", json)
        })


    });

}


const errCallback = (transaction, results) => {
    console.warn(transaction, results);
}



// global variables

let player1;
let player2;
let cardsFirst;
var radio;
var isFirst = true;
var i = 0;
//Json
var Game = {
    player1: null,
    player2: null,
    level: null
};

var Data = {
    numCurrentPlayer:0,
    whosTurn:0,
    shuffleIsNeeded:true,
    player1: null,
    player2: null, 
    level: null,
    scorePlayer1:0,
    scorePlayer2:0,
    cardsArray: null
};