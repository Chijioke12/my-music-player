document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var permissions = cordova.plugins.permissions;
    var list = [
        permissions.READ_EXTERNAL_STORAGE,
        permissions.READ_MEDIA_AUDIO // For Android 13+
    ];

    permissions.requestPermissions(list, function(status) {
        if(status.hasPermission) {
            document.getElementById('status').innerText = "Permission Granted!";
            loadMusic();
        } else {
            document.getElementById('status').innerText = "Permission Denied";
        }
    }, function() {
        document.getElementById('status').innerText = "Error requesting permission";
    });
}

function loadMusic() {
    // This is where you would use cordova-plugin-file to scan for mp3s
    console.log("Ready to scan storage...");
}
