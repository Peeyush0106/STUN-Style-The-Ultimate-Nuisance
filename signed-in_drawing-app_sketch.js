var drawing = [];
var currentPath;
var saveBtn, drawingOpts, drawingBtn, showDrawingList, backBtn;
var drawingObjsHidden = true;
var drawBtnPressed = false;
var _openDrawingPressed = false;
var drawingName;
var allDrawings, allSavedDrawings, allUnsavedDrawings;
var allSavedDrawingNames = [];
var allUnsavedDrawingNames = [];
const drawingObjs = [];
var allData;
var readyToGo = false;
var connectionMade = false;
var currentColor = "black";
var defineColorSelected = false;

var loading;

function setup() {
    canvas = createCanvas(window.innerWidth * 1500 / 1440, window.innerHeight * 1500 / 1440);
    background("white");
    canvas.canvas.hidden = true;
    canvas.mousePressed(startPath);
    saveBtn = document.getElementById("save-btn");
    drawingOpts = document.getElementById("drawing-options");
    drawingBtn = document.getElementById("start-drawing");
    showDrawingList = document.getElementById("show-drawing-list");
    backBtn = document.getElementById("back-btn");
    loading = document.getElementById("loading");
    drawingObjs.push(canvas.canvas);
    drawingObjs.push(drawingOpts);
    toggleHidingDrawObjs(true);
}

var bg_colors = [
    "black",
    "red",
    "green",
    "blue",
    "yellow",
    "magenta",
    "cyan"
];
var txt_colors = [
    "white",
    "white",
    "white",
    "white",
    "black",
    "white",
    "black"
];

function addColorBtns() {
    for (var i = 0; i < bg_colors.length; i++) {
        var div = document.createElement("span");
        div.innerHTML = `
            <button
                id="color-btn-` + bg_colors[i] + `"
                onclick=switchColor("` + i + `")
            >`
            + bg_colors[i] + `
            </button>
        `;
        document.getElementById("color-btns").appendChild(div);
        document.getElementById("color-btn-" + bg_colors[i]).style.backgroundColor = bg_colors[i];
        document.getElementById("color-btn-" + bg_colors[i]).style.color = txt_colors[i];
        document.getElementById("color-btn-" + bg_colors[i]).style.transition = "1s";
    }
    document.getElementById("color-btn-black").style.transform = "scale(1.2)";
    var div = document.createElement("span");
    div.innerHTML = `
        <input
            type="color"
            id="define-color"
        />
    `;
    document.getElementById("color-btns").appendChild(div);
    document.getElementById("define-color").addEventListener("change", function (e) {
        e.preventDefault();
        if (defineColorSelected) {
            currentColor = document.getElementById("define-color").value;
        }
    });
    document.getElementById("define-color").addEventListener("click", function () {
        switchColor("define");
        for (var i = 0; i < bg_colors.length; i++) {
            document.getElementById("color-btn-" + bg_colors[i]).style.transform = "scale(1)";
        }
        document.getElementById("define-color").style.transform = "scale(1.2)";
        defineColorSelected = true;
        currentColor = document.getElementById("define-color").value;
    });
}

function switchColor(colorIndex) {
    if (colorIndex === "define") {
        for (var i = 0; i < bg_colors.length; i++) {
            document.getElementById("color-btn-" + bg_colors[i]).style.transform = "scale(1)";
        }
        document.getElementById("define-color").style.transform = "scale(1.2)";
        defineColorSelected = true;
    }
    else if (colorIndex) {
        defineColorSelected = false;
        currentColor = bg_colors[colorIndex];
        document.getElementById("define-color").style.transform = "scale(1)";
        for (var i = 0; i < bg_colors.length; i++) {
            document.getElementById("color-btn-" + bg_colors[i]).style.transform = "scale(1)";
        }
        document.getElementById("color-btn-" + currentColor).style.transform = "scale(1.2)";
    }
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
    if (drawBtnPressed) {
        background("white");
        push();
        noFill();
        strokeWeight(5);
        stroke("black");
        rect(10, 10, canvas.width - 10, canvas.height - 10);
        pop();
        if (mouseIsPressed) {
            var point = {
                x: mouseX,
                y: mouseY,
                drawingColor: currentColor
            }
            currentPath.push(point);
            drawing.push(currentPath);
        }
        strokeWeight(4);
        noFill();
        for (var i = 0; i < drawing.length; i++) {
            var path = drawing[i];
            beginShape();
            for (var j = 0; j < path.length; j++) {
                var strokeColor = path[j].drawingColor ? path[j].drawingColor : "black";
                stroke(strokeColor);
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
        drawingBtn.hidden = true;
    }
}

document.getElementById("start-drawing").addEventListener("click", () => {
    drawing = [];
    drawingName = "";
    clear();
    drawBtnPressed = true;
    backBtn.hidden = false;
    canvas.canvas.hidden = false;
    saveBtn.hidden = false;
    if (document.getElementById("no-drawings")) {
        document.getElementById("no-drawings").hidden = true;
    }
    if (document.getElementById("all-drawings-list")) {
        document.getElementById("all-drawings-list").parentElement.removeChild(document.getElementById("all-drawings-list"));
    }
    addColorBtns();
});

document.getElementById("show-drawing-list").addEventListener("click", () => {
    drawingName = "";
    document.getElementById("color-btns").innerHTML = "";
    if (allData["Drawings"]) {
        if (document.getElementById("all-drawings-list")) {
            document.getElementById("all-drawings-list").parentElement.removeChild(document.getElementById("all-drawings-list"));
        }
        var ul = document.createElement("ul");
        document.body.appendChild(ul);
        ul.id = "all-drawings-list";
        canvas.canvas.hidden = true;
        backBtn.hidden = false;
        createShowDrawingList(ul);
    }
    else {
        document.getElementById("no-drawings").hidden = false;
    }
});

function createShowDrawingList(ul) {
    if (allData["Drawings"]) {
        ul.innerHTML = "";
        for (const i in allData["Drawings"]["Saved Drawings"]) {
            const drawing = allData["Drawings"]["Saved Drawings"][i];
            var li = document.createElement("li");
            li.id = "open-drawing-li-" + drawing.drawingName;
            li.className = "open-drawing-li";
            var liBtn = document.createElement("button");
            liBtn.innerText = drawing.drawingName;
            liBtn.onclick = function (e) {
                e.preventDefault();
                openDrawing(drawing.drawingName);
            }
            var deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete";
            deleteBtn.className = "delete-drawing-li";
            deleteBtn.onclick = function (e) {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this drawing?")) {
                    var ref = database.ref("Users/" + auth.currentUser.uid + "/Drawings/Saved Drawings/" + drawing.drawingName);
                    ref.remove();
                    ref.once("value", function () {
                        setTimeout(function () {
                            document.getElementById("body").style.transition = ".6s";
                            document.getElementById("body").style.transform = "scale(0.01)";
                            setTimeout(function () {
                                location.reload();
                                setTimeout(function () {
                                    document.getElementById("body").style.transition = "1s";
                                    document.getElementById("body").style.transform = "scale(1.62)";
                                }, 500);
                            }, 600);
                        }, 100);
                    });
                }
            }
            li.appendChild(liBtn);
            li.appendChild(deleteBtn);
            li.appendChild(document.createElement("br"));
            ul.appendChild(li);
        }
    }
}

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