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
            savingDrawing = true;
            var ref = database.ref("Users/" + auth.currentUser.uid + "/Drawings/Saved Drawings/" + drawingName);
            ref.update({
                drawingData: drawing,
                drawingName: drawingName
            });
            ref.once('value', function () {
                savingDrawing = false;
            })
        }
    }
    else {
        alert("Please make a drawing to save. We can't save a blank drawing..");
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
}

function drawingHome() {
    document.getElementById("color-btns").innerHTML = "";
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
                    !allData["Drawings"]
                    ||
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

function backToHome() {
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