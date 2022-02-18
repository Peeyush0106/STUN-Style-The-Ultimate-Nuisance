var drawing = [];
var currentPath;
var saveBtn, drawingOpts, bAndWDrawingBtn, showDrawingList, backBtn;
var drawingObjsHidden = true;
var _drawBAndWPressed = false;
var _openDrawingPressed = false;
var drawingName;
var allDrawings, allSavedDrawings, allUnsavedDrawings;
var allSavedDrawingNames = [];
var allUnsavedDrawingNames = [];
const drawingObjs = [];
var allData;
var readyToGo = false;
var connectionMade = false;

var loading;

function setup() {
    canvas = createCanvas(window.innerWidth * 1000 / 1440, window.innerHeight * 1000 / 1440);
    background("white");
    canvas.canvas.hidden = true;
    canvas.mousePressed(startPath);
    saveBtn = document.getElementById("save-btn");
    drawingOpts = document.getElementById("drawing-options");
    bAndWDrawingBtn = document.getElementById("start-drawing-b-and-w");
    showDrawingList = document.getElementById("show-drawing-list");
    backBtn = document.getElementById("back-btn");
    loading = document.getElementById("loading");
    drawingObjs.push(canvas.canvas);
    drawingObjs.push(drawingOpts);
    toggleHidingDrawObjs(true);
}

function toggleHidingDrawObjs(hiding) {
    for (var i = 0; i < drawingObjs.length; i++) {
        drawingObjsHidden = hiding;
        drawingObjs[i].hidden = drawingObjsHidden;
    }
}

function startPath() {
    currentPath = [];
}

function draw() {
    if (_drawBAndWPressed) {
        background("white");
        push();
        noFill();
        stroke("black");
        strokeWeight(5);
        rect(10, 10, canvas.width - 10, canvas.height - 10);
        pop();
        if (mouseIsPressed) {
            var point = {
                x: mouseX,
                y: mouseY
            }
            currentPath.push(point);
            drawing.push(currentPath);
        }
        stroke("black");
        strokeWeight(4);
        noFill();
        for (var i = 0; i < drawing.length; i++) {
            var path = drawing[i];
            beginShape();
            for (var j = 0; j < path.length; j++) {
                vertex(path[j].x, path[j].y);
            }
            endShape();
        }
        if (drawingObjsHidden) {
            toggleHidingDrawObjs(false);
        }
        getAllDrawings();
    }
    if (connectionMade) {
        database.ref("Users/" + auth.currentUser.uid).get().then(function (data) {
            allData = data.val();
        });
    }
    else {
        bAndWDrawingBtn.hidden = true;
    }
}

function saveDrawingToDatabase() {
    var overlapping = true;
    var overlappingMsgClosed = false;
    var cancel = false;
    if (drawing[0]) {
        if (!drawingName) {
            drawingName = prompt("Please Enter a Name for your Drawing");
            if (drawingName === "") {
                saveDrawingToDatabase();
                cancel = true;
            }
            else if (!drawingName) {
                overlapping = false;
                cancel = true;
            }
            else if (!cancel) {
                for (var i in allSavedDrawingNames) {
                    if (allSavedDrawingNames[i] === drawingName && !overlappingMsgClosed) {
                        overlapping = confirm("You already have a drawing saved with this file name. Do you want to overlap that drawing? Press 'Ok' to Overlap, and Cancel and to Save it with a different name");
                        overlappingMsgClosed = true;
                        if (!overlapping) {
                            saveDrawingToDatabase();
                            break;
                        }
                    }
                }
            }
        }
        if (overlapping && !cancel) {
            database.ref("Users/" + auth.currentUser.uid + "/Drawings/Saved Drawings/" + drawingName).update({
                drawingData: drawing,
                drawingName: drawingName
            });
        }
    }
    else {
        alert("Please make a drawing to save. We can't save a blank drawing..");
    }
}

document.getElementById("start-drawing-b-and-w").addEventListener("click", () => {
    drawing = [];
    drawingName = "";
    clear();
    _drawBAndWPressed = true;
    backBtn.hidden = false;
    canvas.canvas.hidden = false;
    saveBtn.hidden = false;
    if (document.getElementById("no-drawings")) {
        document.getElementById("no-drawings").hidden = true;
    }
    if (document.getElementById("all-drawings-list")) {
        document.getElementById("all-drawings-list").parentElement.removeChild(document.getElementById("all-drawings-list"));
    }
});

document.getElementById("show-drawing-list").addEventListener("click", () => {
    drawingName = "";
    if (allData["Drawings"]) {
        if (document.getElementById("all-drawings-list")) {
            document.getElementById("all-drawings-list").parentElement.removeChild(document.getElementById("all-drawings-list"));
        }
        var ul = document.createElement("ul");
        document.body.appendChild(ul);
        ul.id = "all-drawings-list";
        canvas.canvas.hidden = true;
        backBtn.hidden = false;

        for (const i in allData["Drawings"]["Saved Drawings"]) {
            const drawing = allData["Drawings"]["Saved Drawings"][i];
            var li = document.createElement("li");
            li.id = "open-drawing-li-" + drawing.drawingName;
            li.className = "open-drawing-li";
            var a = document.createElement("a");
            a.innerText = drawing.drawingName;
            a.onclick = function (e) {
                e.preventDefault();
                openDrawing(drawing.drawingName);
            }
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
    else {
        document.getElementById("no-drawings").hidden = false;
    }
});

window.onbeforeunload = function () {
    serialNo = 1;
    for (var i in allUnsavedDrawings) {
        if (parseInt(allUnsavedDrawings[i].drawingName.slice(9, 10)) === serialNo) {
            serialNo += 1;
        }
    }
    if (drawing[0]) {
        /*
            IMPORTANT: UNCOMMENT THIS WHEN RECOVERING UNSAVED DRAWINGS
            database.ref("Users/" + auth.currentUser.uid + "/Drawings/Unsaved Drawings/ Drawing (" + serialNo + ")").update({
                drawingData: drawing,
                drawingName: ("Drawing (" + serialNo + ")")
            });
        */
    }
}

function getAllDrawings() {
    allDrawings = allData["Drawings"];

    if (allDrawings) {
        allSavedDrawings = allDrawings["Saved Drawings"];
        allUnsavedDrawings = allDrawings["Unsaved Drawings"];

        allSavedDrawingNames = [];
        allUnsavedDrawingNames = [];

        if (allSavedDrawings) {
            for (var i in allSavedDrawings) {
                allSavedDrawingNames.push(allSavedDrawings[i].drawingName);
            }
        }

        if (allUnsavedDrawings) {
            for (var i in allUnsavedDrawings) {
                allUnsavedDrawingNames.push(allUnsavedDrawings[i].drawingName);
            }
        }
    }
}

function openDrawing(name) {
    canvas.canvas.hidden = false;
    clear();
    drawing = allData["Drawings"]["Saved Drawings"][name].drawingData;
    stroke("black");
    strokeWeight(4);
    noFill();
    for (var i = 0; i < drawing.length; i++) {
        var path = drawing[i];
        beginShape();
        for (var j = 0; j < path.length; j++) {
            vertex(path[j].x, path[j].y);
        }
        endShape();
    }
}

function drawingHome() {
    if (_drawBAndWPressed) {
        if (
            drawing[0]
            &&
            (
                (
                    allData["Drawings"]
                    &&
                    allData["Drawings"]["Saved Drawings"]
                    &&
                    allData["Drawings"]["Saved Drawings"][drawingName] !== drawing
                )
                ||
                (
                    !allData["Drawings"]["Saved Drawings"]
                    ||
                    !allData["Drawings"]["Saved Drawings"][drawingName]
                )
            )
        ) {
            if (confirm("Do you want to save changes to your drawing before leaving?")) {
                saveDrawingToDatabase();
                drawing = [];
            }
        }
        setTimeout(function () {
            document.getElementById("body").style.transition = ".6s";
            document.getElementById("body").style.transform = "scale(0.01)";
            setTimeout(function () {
                _drawBAndWPressed = false;
                backBtn.hidden = true;
                canvas.canvas.hidden = true;
                saveBtn.hidden = true;
                bAndWDrawingBtn.hidden = false;
                showDrawingList.hidden = false;
                drawingName = "";
                setTimeout(function () {
                    document.getElementById("body").style.transition = "1s";
                    document.getElementById("body").style.transform = "scale(1.62)";
                }, 500);
            }, 600);
        }, 100);
    }
    else if (document.getElementById("no-drawings")) {
        document.getElementById("no-drawings").hidden = true;
    }

    if (document.getElementById("all-drawings-list")) {
        backBtn.hidden = true;
        document.getElementById("all-drawings-list").parentElement.removeChild(document.getElementById("all-drawings-list"));
    }
}

function backToHome(){
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_index.html";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}