function notifyMe(file, msg, id) {
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