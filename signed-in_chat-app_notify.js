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
        var notification = new Notification('STUN: Starting Google Meet', {
            icon: 'https://seeklogo.net/wp-content/uploads/2020/11/google-meet-logo.png',
            body: "Click this notification to share google meet invtie!",
        });

        notification.onclick = function () {
            if (functionToCall) functionToCall();
        };
    }
}