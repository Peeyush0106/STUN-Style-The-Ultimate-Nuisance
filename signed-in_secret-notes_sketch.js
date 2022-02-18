var firstTimeZoomedIn = false;
var recievedNotes = false;

checkConnectionEverySecond();

function checkConnectionEverySecond() {
    setTimeout(function () {
        checkConnectionEverySecond();
    }, 1000);

    if (canvas) {
        canvas.width = window.outerWidth - 100;

        var connectedRef = database.ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val()) {
                animationStarted = false;
                canvas.elt.hidden = true;
                if (!firstTimeZoomedIn) {
                    document.getElementById("body").style.transition = ".6s";
                    document.getElementById("body").style.transform = "scale(1.62)";
                    firstTimeZoomedIn = true;
                }
                if (!auth.currentUser) location.href = "index.html";
                if (!recievedNotes) {
                    getNotes();

                    addNoteBtn = document.createElement("button");
                    addNoteBtn.id = "add-note";
                    addNoteBtn.innerHTML = `
                        <img src="plus.png" height="` + window.innerWidth * 100 / 1440 + `" />
                        <p>
                            Add a secret note
                        </p>
                    `;
                    recievedNotes = true;
                    document.getElementById("body").appendChild(addNoteBtn);

                    document.getElementById("add-note").addEventListener("click", (e) => {
                        e.preventDefault();
                        addNote();
                    });
                }
            }
            else {
                setContinuousLoadingAnim();
                animationStarted = true;
                canvas.elt.hidden = false;
            }
        });
    }
}

function getNotes() {
    database.ref("Users/" + auth.currentUser.uid + "/Secret Notes").get().then((data) => {
        if (data.exists()) {
            var notes = data.val();
            for (const i in notes) {
                const note = notes[i];
                var noteP = document.createElement("p");
                noteP.id = "noteP-" + note.key;
                noteP.className = "secret-note-link";
                var noteName = note.name.length > 3 ? note.name.slice(0, 3) + ".." : note.name
                noteP.innerText = "Open note: " + noteName + " (" + note.date + ")";
                document.getElementById("notes").appendChild(noteP);
                document.getElementById("notes").appendChild(document.createElement("br"));

                document.getElementById("noteP-" + note.key).addEventListener("click", () => {
                    openNote(note.key);
                });
            }
        }
        else {
            document.getElementById("notes").appendChild(document.createTextNode("You don't have any notes currently."));
        }
        animationStarted = false;
        canvas.elt.hidden = true;
        setTimeout(function () {
            document.getElementById("body").style.transition = ".6s";
            document.getElementById("body").style.transform = "scale(1.62)";
        }, 100);
    });
}

function addNote() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            document.getElementById("add-note-elts").hidden = false;
            document.getElementById("notes").innerHTML = "";
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function saveNote() {
    if (document.getElementById("note-inpt").value === "") {
        alert("Please enter a note");
    }
    else {
        var name = prompt("Name of your note (date will automatically be added)");
        var password = prompt("Set a password for this note. Leave it blank to skip password-protection.");
        if (name === "") {
            saveNote();
        }
        else {
            var today = new Date();
            var date = today.getDate();
            var day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][today.getDay() - 1];
            var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dev"][today.getMonth()];
            var year = today.getFullYear();
            var noteDate = day + ", " + date + " " + month + " " + year;

            var pushReference = database.ref("Users/" + auth.currentUser.uid + "/Secret Notes").push();
            var dataKey = pushReference.key;
            var data = {
                name: name,
                data: document.getElementById("note-inpt").value,
                date: noteDate,
                key: dataKey,
                password: password
            }
            pushReference.update(data).then(() => {
                secretNotesHome();
            });
            console.log(dataKey);
        }
    }
}

function secretNotesHome() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            document.getElementById("add-note-elts").hidden = true;
            if (document.getElementById("note-does-not-exist")) {
                document.getElementById("note-does-not-exist").parentElement.removeChild(document.getElementById("note-does-not-exist"));
            }
            document.getElementById("back-btn").hidden = true;
            document.getElementById("note-display").innerHTML = "";
            getNotes();
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function setContinuousLoadingAnim() {
    setTimeout(function () {
        if (animationStarted) {
            showLoadingAnim();
            setContinuousLoadingAnim();
        }
    }, 30);
}

function openNote(key) {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            document.getElementById("notes").innerHTML = "";
            document.getElementById("back-btn").hidden = false;
            database.ref("Users/" + auth.currentUser.uid + "/Secret Notes/" + key).get().then((data) => {
                if (data.exists()) {
                    var note = data.val();
                    if (note.password) {
                        var pwdEntered = prompt("Enter note password: ");
                        if (pwdEntered === note.password) {
                            var h4 = document.createElement("h4");
                            h4.innerText = note.data;
                            document.getElementById("note-display").appendChild(h4);
                        }
                        else {
                            alert("Incorrect password!");
                            secretNotesHome();
                        }
                    }
                    else {
                        var h4 = document.createElement("h4");
                        h4.innerText = note.data;
                        document.getElementById("note-display").appendChild(h4);
                    }
                }
                else {
                    var h1 = document.createElement("h1");
                    h1.id = "note-does-not-exist";
                    h1.innerHTML = "This note does not exist, or we are having issues. <br> Please try again later if you are sure if this exists.";
                    document.getElementById("body").appendChild(h1);
                }
            });
            setTimeout(function () {
                document.getElementById("body").style.transition = "1s";
                document.getElementById("body").style.transform = "scale(1.62)";
            }, 500);
        }, 600);
    }, 100);
}

function backToHome() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_index.html";
        }, 600);
    }, 100);
}