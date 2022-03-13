// Database setup
var database = firebase.database();
var storageRef = firebase.storage().ref("files");
var auth = firebase.auth();
var messaging = firebase.messaging();


var attach, fileUpload, messages, msgPos, msgVals, txtElt, img_selected, cancelledUpload, choosingFile;
// Connection indicators
var noConnectionTimer = 0;
var shownHelloGif = false;
var msgInQueue = [];
var connectingPAdded = false;
var connectingP = document.createElement("p");
connectingP.innerText = "Connecting to database...";
var loading_show = false;
var choosingFile = false;
var fileAboutToUploadState = false;
var allMessages = "initialization";
var directHelloShow = true;
var initMsgAnimShown = false;
var uploadingFile = false;
var firstMsgPlot = true;
var wait = false;
var cancelledOpenContactCard = true;
var mouseOnContactCard = false;
var mouseOverEventsAdded = true;
var userName = "";
var joinedChat = false;
var statusCodes = {
    "busy": "rgb(255, 0, 0)",
    "dnd": "rgb(255, 0, 0)",
    "away": "rgb(255, 208, 0)",
    "avail": "rgb(0, 255, 0)",
}

var profileListenersAdded = false;

cancelledUpload = false;

fileUpload = document.getElementById("file-upload");
filePath = document.getElementById("spnFilePath");

uploadLocallyBtn = document.getElementById("imgFileUpload");
uploadLocallyBtn.hidden = true;
uploadLocallyBtn.onclick = function () {
    fileUpload.click();
    cancelledUpload = false;
    choosingFile = true;
};
uploadToDatabaseBtn = document.getElementById("upload-btn");
uploadToDatabaseBtn.onclick = function () {
    loading_show = true;
    getNoOfMessages(function (noOfMsg) {
        uploadMessage(0, noOfMsg + 1);
    });
    uploadedImgElts.hidden = true;
    imgFileUpload.src = "signed-in_chat-app_attachment.png";
    filePath.innerHTML = "";
    uploadLocallyBtn.hidden = false;
    document.getElementById("uploaded-img").src = "";
    document.getElementById("uploaded-img").alt = "";
    cancelledUpload = true;
    fileAboutToUploadState = false;
    uploadingFile = false;
    document.getElementById("meet-btn").hidden = false;
};

function getNoOfMessages(functionToCall) {
    database.ref("messages").get().then((data) => {
        var messages = 0;
        msgNo = messages + 1;
        if (data.exists()) {
            for (const i in data.val()) {
                messages++;
                msgNo++;
            }
        }
        if (functionToCall) functionToCall(messages);
    });
}

async function uploadMessage(i, noOfMsg) {
    loading_show = true;
    var file = fileUpload.files[i];
    document.getElementById("messages").innerHTML = "";

    fileRef = storageRef.child(file.name);
    fileRef.put(file).then(() => {
        fileRef.getDownloadURL().then(url => {
            database.ref("messages/" + noOfMsg).update({
                fileURL: url,
                fileName: file.name,
                sentById: auth.currentUser.uid
            }).then(() => {
                document.getElementById("messages").hidden = false;
                window.scrollTo(0, document.documentElement.scrollHeight);
                i++;
                noOfMsg++;
                console.log(i, fileUpload.files);
                if (i !== fileUpload.files.length) uploadMessage(i, noOfMsg);
                else loading_show = false;
                window.scrollTo(0, document.documentElement.scrollHeight);
            });
        });
    });
}

uploadedImgElts = document.getElementById("uploaded-img-elts");
document.getElementById("cncl-btn").onclick = function () {
    uploadedImgElts.hidden = true;
    imgFileUpload.src = "signed-in_chat-app_attachment.png";
    filePath.innerHTML = "";
    uploadLocallyBtn.hidden = false;
    document.getElementById("uploaded-img").src = "";
    document.getElementById("uploaded-img").alt = "";
    document.getElementById("file-upload-form").reset();
    cancelledUpload = true;
    uploadingFile = false;
    fileAboutToUploadState = false;
    document.getElementById("messages").hidden = false;
    document.getElementById("meet-btn").hidden = false;
};

auth.onAuthStateChanged(() => {
    if (!connectingPAdded) {
        connectingP.innerText = "Authenticating user.."
        document.body.appendChild(connectingP);
        connectingPAdded = true;
        setTimeout(() => {
            if (auth.currentUser) {
                setInterval(function () {
                    if (auth.currentUser) {
                        refreshMsgSet();
                        refreshStatus();
                    }
                }, 50);
                if (joinedChat) document.getElementById("meet-btn").hidden = false;
            }
            else {
                fileUpload.style.display = "none";
                filePath.style.display = "none";
                uploadLocallyBtn.style.display = "none";
                uploadToDatabaseBtn.style.display = "none";
                document.getElementById("msg-box").style.display = "none";
                document.getElementById("send-btn").style.display = "none";
                loading_show = true;
                location.href = "index.html";
            }
        }, 3000);
    }
});

function addMessage(addedMsg, msgNo) {
    msgInQueue.push(addedMsg);
    document.getElementById("msg-box").value = "";
    database.ref("messages/" + msgNo).update({
        msg: addedMsg,
        sentById: auth.currentUser.uid
    }).then(() => {
        refreshMsgSet();
    });
}

function getUserProfile(id, functionToCall) {
    database.ref("Users/" + id + "/userData").get().then((data) => {
        if (data.exists()) {
            var pic = data.val().profilePicURL === "blank" ? "signed-in_chat-app_blank-profile-pic.jpg" : data.val().profilePicURL;
            var status = data.val().status === "dnd" ? "Do Not Disturb" : data.val().status === "avail" ? "Available" : data.val().status;
            if (functionToCall) functionToCall(data.val().name, pic, data.val().statusMsg, data.val().email, status);
        }
    });
}

var noOfPlots = 0;
var msgNo = 0;
var msgSenderIds = [];

var prevMsgData = {};
var newMsgData = {};

function refreshMsgSet() {
    if (auth.currentUser) {
        database.ref("messages").get().then((allMsgData) => {
            newMsgData = allMsgData.val();
            if (JSON.stringify(allMessages) !== JSON.stringify(allMsgData.val())) {
                if (allMessages !== "initialization" && JSON.stringify(allMessages) !== null && allMsgData.val() === null) location.reload();
                allMessages = allMsgData.val();
                msgData = allMsgData.val();
                for (const j in msgData) {
                    const msg = msgData[j];
                    const oldMsg = prevMsgData[j];
                    console.log(msg, oldMsg);
                    if (JSON.stringify(msg) !== JSON.stringify(oldMsg)) {
                        prevMsgData[j] = msg;
                        console.log(prevMsgData);
                        var message;
                        getUserProfile(msg.sentById, (msgSenderName, msgSenderPic) => {
                            var msgSenderId = msg.sentById;
                            if (msgSenderName.length > 15) msgSenderName = msgSenderName.slice(0, 15) + " ...";

                            if (msg.fileURL && msg.fileName) {
                                noOfPlots++;
                                getNoOfMessages(function () {
                                    msgSenderIds.push(msgSenderId);
                                    var fileName, fileURL;
                                    if (msg.fileName.length > 15) {
                                        fileName = msg.fileName.slice(0, 15) + " ...";
                                    }
                                    else fileName = msg.fileName;
                                    fileURL = msg.fileURL;

                                    message = document.createElement("div");
                                    a = document.createElement("a");
                                    img = document.createElement("img");

                                    img.src = msgSenderPic;
                                    img.className = "profileImgMsg";
                                    img.width = 50;
                                    img.id = "msgProfileImg" + msgNo;

                                    a.href = fileURL;
                                    a.innerHTML = "<br> Open file: " + fileName;
                                    a.target = "_blank";

                                    message.appendChild(img);
                                    message.innerHTML += `<br> <span style="font-size: 50%">` + msgSenderName + `</span>`;
                                    message.className = "msg";

                                    message.appendChild(a);

                                    document.getElementById("messages").appendChild(message);
                                    document.getElementById("messages").appendChild(document.createElement("br"));
                                    document.getElementById("messages").appendChild(document.createElement("br"));

                                    message.style.backgroundColor = msgSenderId === auth.currentUser.uid ? "wheat" : "skyblue";
                                    // message.style.marginLeft = msgSenderId === auth.currentUser.uid ? "50%" : "25%";
                                });
                            }
                            else if (msg.msg) {
                                noOfPlots++;
                                getNoOfMessages(function () {
                                    msgSenderIds.push(msgSenderId);
                                    var msgTxt = msg.msg;

                                    message = document.createElement("div");
                                    p = document.createElement("p");
                                    img = document.createElement("img");

                                    img.src = msgSenderPic;
                                    img.className = "profileImgMsg";
                                    img.width = 50;
                                    img.id = "msgProfileImg" + msgNo;

                                    p.innerHTML = msgTxt;

                                    message.appendChild(img);
                                    message.innerHTML += `<div style="font-size: 50%">` + msgSenderName + `</div>`;
                                    message.className = "msg";

                                    message.appendChild(p);
                                    document.getElementById("messages").appendChild(message);
                                    document.getElementById("messages").appendChild(document.createElement("br"));
                                    document.getElementById("messages").appendChild(document.createElement("br"));

                                    message.style.backgroundColor = msgSenderId === auth.currentUser.uid ? "wheat" : "skyblue";
                                    // message.style.marginLeft = msgSenderId === auth.currentUser.uid ? "50%" : "25%";
                                });
                            }
                            if (parseInt(j) === msgData.length) for (var i = 0; i < 10; i++) document.getElementById("messages").appendChild(document.createElement("br"));
                        });
                    }
                }
            }
            if (!allMsgData.exists()) {
                setInterval(showHelloGif, 1000);
            }
        });
    }
    if (noOfPlots === msgNo - 1 && noOfPlots !== 0 && msgNo !== 0) {
        if (!uploadingFile && joinedChat) document.getElementById("messages").hidden = false;
        if (firstMsgPlot) {
            window.scrollTo(0, document.documentElement.scrollHeight);
            firstMsgPlot = false;
        }
    }
    for (var k = 1; k < noOfPlots + 1; k++) {
        var msgSenderId = msgSenderIds[k - 1];
        if (document.getElementById("msgProfileImg" + k)) {
            addContactCardListener(k, msgSenderId);
        }
    }
}

function addContactCardListener(k, msgSenderId) {
    document.getElementById("msgProfileImg" + k).onmouseover = function () {
        openContactCard(msgSenderId);
        console.log(msgSenderId);
        cancelledOpenContactCard = false;
    };
    document.getElementById("contact-card-close").addEventListener("click", () => {
        cancelledOpenContactCard = true;
        document.getElementById("contact-card").style.opacity = 0;
    });
}

function openContactCard(msgSenderId) {
    getUserProfile(msgSenderId, (name, pic, statusMsg, email, status) => {
        if (document.getElementById("contact-card").style.opacity > 0 && document.getElementById("contact-card-email").innerText != email) {
            document.getElementById("contact-card").style.opacity = 0;
            setTimeout(function () {
                document.getElementById("contact-card-name").innerText = name;
                document.getElementById("contact-card-email").innerText = email;
                document.getElementById("contact-card-img").src = pic;
                document.getElementById("contact-card-status-msg").innerText = statusMsg;
                document.getElementById("contact-card-status").innerText = status;
                if (!cancelledOpenContactCard) {
                    document.getElementById("contact-card").style.opacity = 1;
                }
            }, 1000);
        }
        else {
            document.getElementById("contact-card-name").innerText = name;
            document.getElementById("contact-card-email").innerText = email;
            document.getElementById("contact-card-img").src = pic;
            document.getElementById("contact-card-status-msg").innerText = statusMsg;
            document.getElementById("contact-card-status").innerText = status;
            if (!cancelledOpenContactCard) {
                document.getElementById("contact-card").style.opacity = 1;
            }
        }
    });
}

function showHelloGif() {
    database.ref("messages").get().then((data) => {
        if (!data.exists() && !document.getElementById("no-msg-info")) {
            var randomHelloGifNumber = randomNo(0, 3);
            var allHelloGifs = ["signed-in_chat-app_hello.gif", "signed-in_chat-app_hello-2.gif", "signed-in_chat-app_hello-3.webp", "signed-in_chat-app_hello-4.gif"];
            no_message_info = document.createElement("p");
            no_message_info.innerHTML = `
                    no messages yet.. <br>
                    Start chatiting by saying <br> <button onclick="sendHello();" id="helloBtn"> Hello </button> <br><br>
                    <img src=` + allHelloGifs[randomHelloGifNumber] + ` id="hello-gif" width=200 />
                `;
            no_message_info.id = "no-msg-info";
            document.body.appendChild(no_message_info);
        }
    });
}

function randomNo(min, max) { return Math.round(Math.random() * (max - min)); }

fileUpload.onchange = function () {
    filePath.innerHTML = "<b> Selected File: </b>";
    uploadingFile = true;
    for (var i = 0; i < fileUpload.files.length; i++) {
        if (fileUpload.files[i] && !cancelledUpload && choosingFile) {
            fileAboutToUploadState = true;
            var fileName = fileUpload.files[i].name.split('\\')[fileUpload.files[i].name.split('\\').length - 1];
            filePath.innerHTML += i === fileUpload.files.length - 1 ? fileName : fileName + ", ";

            // showing an image if it is an image
            if (fileUpload.files[i].type.slice(0, 5) === "image") {
                var img = document.createElement("img");
                img.src = URL.createObjectURL(fileUpload.files[i])
                img.style.maxWidth = "200px";
                document.getElementById("uploaded-img-txt-img").appendChild(img);
            }
            uploadLocallyBtn.hidden = true;
            document.getElementById("meet-btn").hidden = true;
            uploadedImgElts.hidden = false;
            document.getElementById("messages").hidden = true;
        }
    }
}

document.getElementById("uploaded-img").onload = function () {
    if (document.getElementById("uploaded-img").width < 100) document.getElementById("uploaded-img").width = 100;
    if (document.getElementById("uploaded-img").width > window.screen.availWidth) document.getElementById("uploaded-img").width = window.screen.availWidth - 100;
};

checkConnection();
function checkConnection() {
    setTimeout(function () {
        // Check if we are connected to the internet or not.
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            connected = snap.val();
            if (connected) {
                database.ref("Users/" + auth.currentUser.uid + "/userData/profilePicURL").get().then((picData) => {
                    if (picData.exists() && picData.val()) {
                        var pic = picData.val() === "blank" ? "signed-in_chat-app_blank-profile-pic.jpg" : picData.val();
                        document.getElementById("profile-pic").src = pic;
                        document.getElementById("profile-pic-btn").hidden = false;
                        document.getElementById("status-change-btn").hidden = false;
                    }
                    else {
                        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                            profilePicURL: "blank"
                        });
                    }
                });
                database.ref("Users/" + auth.currentUser.uid + "/userData/email").get().then((emailData) => {
                    if (!emailData.exists() || !emailData.val()) {
                        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                            email: auth.currentUser.email
                        });
                    }
                });
                database.ref("Users/" + auth.currentUser.uid + "/name").get().then((nameData) => {
                    if (nameData.exists() && nameData.val()) {
                        userName = nameData.val();
                        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                            name: nameData.val()
                        }).then(() => {
                            database.ref("Users/" + auth.currentUser.uid + "/name").remove();
                        });
                    }
                });
                database.ref("Users/" + auth.currentUser.uid + "/Chat/joined").get().then((data) => {
                    joinedChat = data.val();
                    if (!data.exists() || !data.val()) {
                        document.getElementById("profile-pic-btn").hidden = true;
                        document.getElementById("status-change-btn").hidden = true;
                        document.getElementById("pin-form").hidden = false;
                        document.getElementById("submit-pin").onclick = function () {
                            if (document.getElementById("pin-inpt").value.toLowerCase() === "debug") {
                                database.ref("Users/" + auth.currentUser.uid + "/Chat").update({
                                    joined: true
                                }).then(() => {
                                    location.reload();
                                });
                            }
                            else {
                                alert("Incorrect pin!");
                            }
                        }
                        document.getElementById("messages").hidden = true;
                        document.getElementById("meet-btn").hidden = true;
                        document.getElementById("messages").innerHTML = "";
                        document.getElementById("msg-box").hidden = true;
                        document.getElementById("send-btn").hidden = true;
                        if (document.getElementById("no-msg-info")) document.getElementById("no-msg-info").hidden = true;
                        document.getElementById("imgFileUpload").style.display = "none";
                    }
                });
                noConnectionTimer = 0;
                if (!fileAboutToUploadState) {
                    uploadLocallyBtn.hidden = false;
                }
                loading_show = false;
                if (connectingPAdded) {
                    document.body.removeChild(connectingP);
                    connectingPAdded = false;
                }
                if (fileAboutToUploadState) {
                    fileUpload.hidden = false;
                    filePath.hidden = false;
                    uploadToDatabaseBtn.hidden = false;
                    uploadedImgElts.hidden = false;
                    document.getElementById("cncl-btn").hidden = false;
                }
            }
            else {
                uploadLocallyBtn.hidden = true;
                fileUpload.hidden = true;
                filePath.hidden = true;
                uploadToDatabaseBtn.hidden = true;
                uploadedImgElts.hidden = true;
                document.getElementById("cncl-btn").hidden = true;

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

function sendMessage(event) {
    if (event && event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        if (document.getElementById("msg-box").value !== "") {
            getNoOfMessages(function (noOfMsg) {
                msgNo = noOfMsg + 1;
                addMessage(document.getElementById("msg-box").value, msgNo);
            });
            if (document.getElementById("no-msg-info")) document.getElementById("no-msg-info").innerHTML = "";
        }
    }
}

function sendHello() {
    no_message_info.innerHTML = "";
    addMessage("Hello", 1, true);
}

window.onload = function () {
    var styling = document.createElement("style");
    styling.innerHTML = `
        #send-btn {
            transition: 1.2s;
            background-color: red;
            border: solid yellowgreen;
            border-radius: 50%;
            border-style: dashed;
            border-width: 5px;
            position: fixed;
            margin-left: 84%;
            bottom: 9%;
        }
        #logout-btn {
            transition: 2.3s;
            position: fixed;
            margin-left: 95%;
            top: 5%;
        }
    `;
    document.body.appendChild(styling);
}

function showStatusOpt() {
    document.getElementById("status-opt").style.opacity = 1;
    document.getElementById("busy").onclick = function () {
        document.getElementById("status-opt").style.opacity = 0;
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            status: "busy"
        });
    }
    document.getElementById("dnd").onclick = function () {
        document.getElementById("status-opt").style.opacity = 0;
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            status: "dnd"
        });
    }
    document.getElementById("away").onclick = function () {
        document.getElementById("status-opt").style.opacity = 0;
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            status: "away"
        });
    }
    document.getElementById("avail").onclick = function () {
        document.getElementById("status-opt").style.opacity = 0;
        database.ref("Users/" + auth.currentUser.uid + "/userData").update({
            status: "avail"
        });
    }
}

function startMeet() {
    notifyMe(function () {
        document.getElementById("meet").click();
        var meetingLink = prompt("Copy link from Google Meet and enter it here");
        if (meetingLink && meetingLink !== "" && meetingLink.slice(0, 24) === "https://meet.google.com/") {
            console.log("send")
            document.getElementById("msg-box").value =
                "Hello, I am inviting you to join this meeting: <a href='" + meetingLink + "' target='_blank'> Meeting link (" + meetingLink.slice(24, 100) + ")</a>"
                ;
            getNoOfMessages(function (noOfMsg) {
                msgNo = noOfMsg + 1;
                addMessage(document.getElementById("msg-box").value, msgNo);
            });
            if (document.getElementById("no-msg-info")) document.getElementById("no-msg-info").innerHTML = "";
        }
        else if (meetingLink === "") {
            startMeet();
        }
    });
}

function refreshStatus() {
    if (document.getElementById("status-opt").style.opacity == 0) {
        database.ref("Users/" + auth.currentUser.uid + "/userData/status").get().then((data) => {
            if (data.val()) {
                document.getElementById(data.val()).checked = true;
                if (data.val() === "dnd") {
                    document.getElementById("status-change-btn").innerText = "-";
                    document.getElementById("status-change-btn").style.fontSize = "20px";
                    document.getElementById("status-change-btn").style.color = "white";
                }
                else {
                    document.getElementById("status-change-btn").innerText = "|";
                    document.getElementById("status-change-btn").style.fontSize = "10px";
                    document.getElementById("status-change-btn").style.color = "transparent";
                }
                document.getElementById("status-change-btn").style.backgroundColor = statusCodes[data.val()]
            }
            else {
                database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                    status: "avail"
                });
            }
        });
    }
}