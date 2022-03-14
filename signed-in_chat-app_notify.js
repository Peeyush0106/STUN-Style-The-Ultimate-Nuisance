document.addEventListener('DOMContentLoaded', function () {
    // browser will ask for permission
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); //if browser is not compatible this will occur
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function notifyMe(functionToCall) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('STUN: Started Google Meet', {
            icon: 'https://seeklogo.net/wp-content/uploads/2020/11/google-meet-logo.png',
            body: "Copy meeting link and from Google Meet and then Switch to STUN to share it.",
        });
    }
}