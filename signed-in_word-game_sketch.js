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
            enableNextWord();
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
                enableNextWord();
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

function giveWordHints() {
    for (var i = currentNo - 4; i < currentNo + 1; i++) {
        document.getElementById("word-box-" + i).style.backgroundColor = "gray";
        document.getElementById("word-box-" + i).style.color = "white";
        document.getElementById("letter-" + document.getElementById("word-box-" + i).value.toUpperCase()).style.backgroundColor = "gray";
        document.getElementById("letter-" + document.getElementById("word-box-" + i).value.toUpperCase()).style.color = "white";

        var letterIndex = 0;
        var noOfCorrectLetters = 0;
        for (var j = currentNo - 4; j < currentNo + 1; j++) {
            letterIndex++;

            var currentLetter = document.getElementById("word-box-" + j).value;
            var answerLetter = ansWord.slice(letterIndex - 1, letterIndex);

            var _letterIndex = 0;
            for (var k = currentNo - 4; k < currentNo + 1; k++) {
                _letterIndex++;

                var _answerLetter = ansWord.slice(_letterIndex - 1, _letterIndex);

                if (currentLetter === _answerLetter) {
                    document.getElementById("word-box-" + j).style.backgroundColor = "yellow";
                    document.getElementById("word-box-" + j).style.color = "black";

                    document.getElementById("letter-" + document.getElementById("word-box-" + j).value.toUpperCase()).style.backgroundColor = "yellow";
                    document.getElementById("letter-" + document.getElementById("word-box-" + j).value.toUpperCase()).style.color = "black";
                }
            }

            if (currentLetter === answerLetter) {
                document.getElementById("word-box-" + j).style.backgroundColor = "green";
                document.getElementById("word-box-" + j).style.color = "white";

                document.getElementById("letter-" + document.getElementById("word-box-" + j).value.toUpperCase()).style.backgroundColor = "green";
                document.getElementById("letter-" + document.getElementById("word-box-" + j).value.toUpperCase()).style.color = "white";
                noOfCorrectLetters++;
            }
        }
    }
    if (noOfCorrectLetters === 5) {
        endGame();
    }
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