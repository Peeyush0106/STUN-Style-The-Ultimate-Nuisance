// Database setup
var database = firebase.database();
var profilePicRef = firebase.storage().ref("profile-pics");
var auth = firebase.auth();
var loading_show = false;
var connectingPAdded = false;
var connectingP = document.createElement("p");
connectingP.innerText = "Connecting to database...";
var loading_show = false;
var cancelClicked = false;
var noConnectionTimer = 0;
var myProfilePicURL = "blank";

function randomNo(min, max) { return Math.round(Math.random() * (max - min)); }

checkConnection();
function checkConnection() {
    setTimeout(function () {
        // Check if we are connected to the internet or not.
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            connected = snap.val();
            if (connected) {
                noConnectionTimer = 0;
                loading_show = false;
                if (connectingPAdded) {
                    document.body.removeChild(connectingP);
                    connectingPAdded = false;
                }
            }
            else {
                if (noConnectionTimer >= 10) {
                    connectingP.innerHTML = "You have very low or no internet connection. Please check your internet speed. If this does not help, try refreshing the page or contacting the owner, <div style='color: red; background-color: blue;'> Peeyush </div>";
                    loading_show = false;
                    connectingP.style["background-color"] = "orange";
                    connectingP.style.color = "black";
                    connectingP.style.fontSize = "30px";
                    connectingP.style.textAlign = "center";
                }
                else {
                    noConnectionTimer += 1;
                    loading_show = true;
                    if (!connectingPAdded) {
                        document.body.appendChild(connectingP);
                        connectingPAdded = true;
                    }
                }
            }
        });
        checkConnection();
    }, 2000);
}

var cameraPhoto;
function takeSnapshot() {
    Webcam.snap(function (data_url) {
        document.getElementById("profile-pic").src = data_url;
        cancelSnapshot();
        cameraPhoto = data_url;
        setProfileImage(false, data_url);
        profilePictureBlank = false;
    });
}

function cancelSnapshot() {
    document.getElementById("change-profile-pic-elts").hidden = false;
    document.getElementById("camera-elts").hidden = true;
}

function setCam() {
    document.getElementById("camera-elts").hidden = false;
    document.getElementById("change-profile-pic-elts").hidden = true;
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'png'
    });
    Webcam.attach('#my_camera');
}

fileUpload = document.getElementById("file-upload");

uploadBtn = document.getElementById("imgFileUpload");
uploadBtn.onclick = function () {
    fileUpload.click();
};

document.getElementById("uploaded-img").onload = function () {
    if (document.getElementById("uploaded-img").width < 100) document.getElementById("uploaded-img").width = 100;
    if (document.getElementById("uploaded-img").width > window.screen.availWidth) document.getElementById("uploaded-img").width = window.screen.availWidth - 100;
};

function chooseProfilePic() {
    setProfileImage(fileUpload.files[0], false);
}

var profilePictureBlank = true;

fileUpload.onchange = function () {
    myProfilePicURL = URL.createObjectURL(event.target.files[0]);
    document.getElementById("profile-pic").src = myProfilePicURL;
    document.getElementById("profile-pic").style.width = "170px";
}

function setProfileImage(file, data_url) {
    if (file && !data_url) {
        document.getElementById("alert-info").hidden = false;
        document.getElementById("saveBtn").disabled = true;
        document.getElementById("saveBtn").style.color = "gray";
        fileRef = profilePicRef.child(auth.currentUser.uid + "-profile-pic");
        fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then(url => {
                myProfilePicURL = url;
                database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                    profilePicURL: myProfilePicURL
                }).then(() => {
                    document.getElementById("profile-pic").src = myProfilePicURL;
                    document.getElementById("profile-pic").style.width = "170px";
                    document.getElementById("alert-info").hidden = true;
                    document.getElementById("saveBtn").disabled = false;
                    document.getElementById("saveBtn").style.color = "black";
                    cancelProfilePic();
                });
            });
        });
    }
    if (!file && data_url) {
        myProfilePicURL = data_url;
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            profilePicURL: myProfilePicURL
        }).then(() => {
            document.getElementById("profile-pic").src = myProfilePicURL;
            document.getElementById("profile-pic").style.width = "170px";
            document.getElementById("alert-info").hidden = true;
            document.getElementById("saveBtn").disabled = false;
            document.getElementById("saveBtn").style.color = "black";
            cancelProfilePic();
        });
    }
}

auth.onAuthStateChanged(function () {
    setInterval(function () {
        console.log("changed");
        if (!auth.currentUser) {
            location.href = "redirector_index.html";
        }
    }, 1000);
});

function backToChat() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_chat-app_index.html";
        }, 600);
    }, 100);
}

function nameChange() {
    document.getElementById("nav-btns").hidden = true;
    setTimeout(function () {
        var enteredName = prompt("Enter new name");
        if (enteredName == "") {
            nameChange();
        }
        else {
            newName = enteredName;
            document.getElementById("chosen-name").innerText = newName;
            document.getElementById("name-change-elts").hidden = false;
        }
        if (!enteredName) {
            document.getElementById("name-change-elts").hidden = true;
            document.getElementById("nav-btns").hidden = false;
        }
    }, 100);
}

function saveName() {
    database.ref("Users/" + auth.currentUser.uid + "/userData").update({
        name: newName
    }).then(() => {
        document.getElementById("name-change-elts").hidden = true;
        document.getElementById("nav-btns").hidden = false;
    });
}

function cancelName() {
    document.getElementById("name-change-elts").hidden = true;
    document.getElementById("nav-btns").hidden = false;
}

function picChange() {
    document.getElementById("nav-btns").hidden = true;
    database.ref("Users/" + auth.currentUser.uid + "/userData/profilePicURL").get().then((data) => {
        if (data.exists() && data.val() != "blank") {
            myProfilePicURL = data.val();
            document.getElementById("profile-pic").src = myProfilePicURL;
            document.getElementById("profile-pic").style.width = "170px";
            document.getElementById("name-change-elts").hidden = true;
            document.getElementById("nav-btns").hidden = true;
            document.getElementById("change-profile-pic-elts").hidden = false;
        }
        document.getElementById("info").hidden = false;
        document.getElementById("change-profile-pic-elts").hidden = false;
        document.getElementById("profile-pic").focus();
    });
}

function cancelProfilePic() {
    document.getElementById("change-profile-pic-elts").hidden = true;
    document.getElementById("nav-btns").hidden = false;
}

function statusChange() {
    document.getElementById("current-msg").innerHTML = "<br> loading..";
    database.ref("Users/" + auth.currentUser.uid + "/userData/statusMsg").get().then((data) => {
        if (data.val()) document.getElementById("current-msg").innerHTML = "<br>" + data.val();
        else document.getElementById("current-msg").innerHTML= "<br> <i> No message </i>"
    });
    document.getElementById("status-area").value = "";
    document.getElementById("status-message-elts").hidden = false;
    document.getElementById("nav-btns").hidden = true;
}

function saveStatus() {
    var status = document.getElementById("status-area").value;
    if (status.length > 500) alert("Exceeded max character limit (500)")
    else {
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            statusMsg: status
        }).then(() => {
            document.getElementById("status-message-elts").hidden = true;
            document.getElementById("nav-btns").hidden = false;
        });
    }
}

function cancelStatus() {
    document.getElementById("status-message-elts").hidden = true;
    document.getElementById("nav-btns").hidden = false;
}