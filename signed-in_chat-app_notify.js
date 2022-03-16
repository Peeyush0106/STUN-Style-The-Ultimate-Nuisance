document.addEventListener('DOMContentLoaded', function () {
    // browser will ask for permission
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); //if browser is not compatible this will occur
        return;
    }
});

function notifyMe(file, msg, id) {
    if (Notification.permission !== "granted") {
        database.ref("Users/" + auth.currentUser.uid + "/userData/alert").get().then((data) => {
            if (!data.exists() || !data.val()) {
                alert("Enable Notifications to keep track of messages in the group");
                database.ref("Users/" + auth.currentUser.uid + "/userData").update({
                    alert: true
                });
            }
        });
        Notification.requestPermission();
    }
    if (id !== auth.currentUser.uid) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            if (file) body = "New file shared";
            if (msg) body = msg;
            getUserProfile(id, function (name, pic, statusMsg, email, status) {
                getUserProfile(auth.currentUser.uid, function (_name, _pic, _statusMsg, _email, _status) {
                    if (_status !== "Do Not Disturb") {
                        new Notification('New message by ' + name, {
                            icon: pic,
                            body: body,
                        });
                    }
                });
            });
        }
    }
}