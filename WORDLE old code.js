var currentRow = 1;
var currentNo = 1;
const ansWord = getCurrentWordSol();
var end = false;

var letters = [
    [
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p"
    ],
    [
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l"
    ],
    [
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m"
    ]
];

window.onload = function () {
    createAlphaTable();
    document.body.style.zoom = 0.85 * window.innerWidth / 1440;
};

window.onresize = function () {
    document.body.style.zoom = 0.85 * window.innerWidth / 1440;
}

setInterval(function () {
    if (!end) {
        document.getElementById("word-box-" + currentNo).focus();
    }
}, 10);

function getCurrentWordSol() {
    var currentWord = data.solutions[Math.floor(Math.random() * data.solutions.length + 1)];
    createTable();
    document.getElementById("word-box-1").disabled = false;
    document.getElementById("word-box-1").focus();
    return currentWord;
}

function createAlphaTable() {
    for (var i = 0; i < letters.length; i++) {
        for (var j = 0; j < letters[i].length; j++) {
            var th = document.createElement("th");
            letters[i][j] = letters[i][j].toUpperCase();
            th.innerText = letters[i][j];
            th.letter = letters[i][j];
            th.id = "letter-" + th.letter;
            th.className = "letter";
            th.onclick = function () {
                var nextBtnNo = 1 + currentNo;
                document.getElementById("word-box-" + currentNo).value = this.letter;
                if (nextBtnNo <= 30) {
                    if (nextBtnNo !== 1 + (5 * currentRow)) {
                        document.getElementById("word-box-" + nextBtnNo).disabled = false;
                        document.getElementById("word-box-" + nextBtnNo).focus();
                        currentNo++;
                    }
                }
                document.getElementById("word-box-" + currentNo).focus();
            }
            document.getElementById("letters-" + (i + 1)).appendChild(th);
        }
    }
}

document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    var returnData = checkWordExistance(currentRow);
    if (returnData === "less-data") {
        alert("Insufficient letters!");
    }
    if (currentNo !== 30) {
        if (returnData === true) {
            giveWordHints();
        }
        else {
            alert("Word does not exist!");
        }
    }
    else {
        endGame();
        alert("The word is: " + ansWord);
    }
});

window.onkeydown = (e) => {
    if (e.keyCode === 13) {
        var returnData = checkWordExistance(currentRow);
        if (returnData === "less-data") {
            alert("Insufficient letters!");
        }
        if (currentNo !== 30) {
            if (returnData == true) {
                giveWordHints();
            }
            else if(returnData == false){
                alert("Word does not exist!");
            }
        }
        else {
            giveWordHints();
            endGame();
            alert("The word is: " + ansWord);
        }
    }
    if (e.keyCode === 8) {
        document.getElementById("word-box-" + currentNo).value = "";
        if (currentNo != (5 * currentRow) - 4) {
            document.getElementById("word-box-" + currentNo).disabled = true;
            currentNo--;
            document.getElementById("word-box-" + currentNo).focus();
        }
    }
}

function createTable() {
    var idNo = 1;
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement("tr");
        document.getElementById("inpt-table-head").appendChild(tr);
        for (var j = 0; j < 5; j++) {
            var th = document.createElement("th");
            var input = document.createElement("textarea");
            input.id = "word-box-" + idNo;
            input.number = idNo;
            input.disabled = true;
            input.cols = 2;
            input.rows = 1;
            input.className = "word-box"
            input.maxLength = 1;
            input.style.resize = "none";
            input.onkeypress = function (e) {
                e.preventDefault();
                var nextBtnNo = 1 + this.number;
                if (e.code.slice(0, 3) == "Key") {
                    document.getElementById("word-box-" + currentNo).value = e.key;
                    if (nextBtnNo <= 30) {
                        if (nextBtnNo !== 1 + (5 * currentRow)) {
                            document.getElementById("word-box-" + nextBtnNo).disabled = false;
                            document.getElementById("word-box-" + nextBtnNo).focus();
                            currentNo++;
                        }
                    }
                }
            }
            th.appendChild(input);
            tr.appendChild(th);
            idNo++;
        }
    }
}

function checkWordExistance(row) {
    var startBoxNo = (5 * row) - 4;
    var word = "";
    var cancel = false;
    if (row === 0) {
        cancel = true;
        return "less-data";
    }
    for (var i = startBoxNo; i < startBoxNo + 5; i++) {
        if (document.getElementById("word-box-" + i).value == "") {
            cancel = true;
            return "less-data";
        }
        else {
            word += document.getElementById("word-box-" + i).value.toLowerCase();
        }
    }
    if (!cancel) {
        var wordExists = false;
        for (var i = 0; i < data.herrings.length; i++) {
            if (word === data.herrings[i]) {
                wordExists = true;
                break;
            }
        }
        for (var i = 0; i < data.solutions.length; i++) {
            if (word === data.solutions[i]) {
                wordExists = true;
                break;
            }
        }
        return wordExists;
    }
}

function disableCurrentRow() {
    for (var i = currentNo - 4; i < currentNo + 1; i++) {
        document.getElementById("word-box-" + i).disabled = true;
    }
}


function enableNextWord() {
    disableCurrentRow();
    currentRow++;
    document.getElementById("word-box-" + (currentNo + 1)).disabled = false;
    document.getElementById("word-box-" + (currentNo + 1)).focus();
    currentNo++;
}

async function giveWordHints() {
    var startBoxNo = (5 * currentRow) - 4;
    var noOfCorrectLetters = 0;
    var guess = "";
    for (var i = startBoxNo; i < startBoxNo + 5; i++) {
        guess += document.getElementById("word-box-" + i).value.toLowerCase();
    }
    for (let i = 0; i < guess.length; i++) {
        for (var j = 1; j < 31; j++) {
            document.getElementById("word-box-" + j).disabled = true;
        }
        setTimeout(function () {
            let guessLetter = guess.charAt(i);
            let solutionLetter = ansWord.charAt(i);
            for (k = 0; k < guess.length; k++) {
                let _guessLetter = guess.charAt(i);
                if (_guessLetter === solutionLetter) {
                    console.log("")
                }
            }
            if (guessLetter === solutionLetter) {
                document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "green";
                document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";

                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "green";
                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "white";

                noOfCorrectLetters++;
            }
            else if (ansWord.indexOf(guessLetter) != -1) {
                document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "yellow";
                document.getElementById("word-box-" + (startBoxNo + i)).style.color = "black";

                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "yellow";
                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "black";
            }
            else {
                document.getElementById("word-box-" + (startBoxNo + i)).style.backgroundColor = "gray";
                document.getElementById("word-box-" + (startBoxNo + i)).style.color = "white";
                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.backgroundColor = "gray";
                document.getElementById("letter-" + document.getElementById("word-box-" + (startBoxNo + i)).value.toUpperCase()).style.color = "white";
            }
            sleep(500);
        }, 0);
    }
    setTimeout(function () {
        if (noOfCorrectLetters === 5) {
            startConfetti();
            setTimeout(function () {
                stopConfetti();
            }, 3000);
            endGame();
        }
        else enableNextWord(noOfCorrectLetters);
    }, 3000);
}

function endGame() {
    end = true;
    var idNo = 1;
    for (var i = 0; i < 6; i++) {
        var tr = document.createElement("tr");
        document.getElementById("inpt-table-head").appendChild(tr);
        for (var j = 0; j < 5; j++) {
            document.getElementById("word-box-" + idNo).style.display = "none";
            var th = document.createElement("th");
            var input = document.createElement("textarea");
            input.id = "word-box-dis-" + idNo;
            input.number = idNo;
            input.disabled = true;
            input.cols = 2;
            input.rows = 1;
            input.value = document.getElementById("word-box-" + idNo).value
            input.style.backgroundColor = document.getElementById("word-box-" + idNo).style.backgroundColor;
            input.style.color = document.getElementById("word-box-" + idNo).style.color;
            input.className = "word-box"
            input.maxLength = 1;
            input.style.resize = "none";
            th.appendChild(input);
            tr.appendChild(th);
            idNo++;
        }
    }
    document.getElementById("submit-btn").parentElement.removeChild(document.getElementById("submit-btn"));
}

function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}