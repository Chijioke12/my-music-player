document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var permissions = cordova.plugins.permissions;
    
    // On Android 13+ (API 33), we need READ_MEDIA_AUDIO
    // On older Android, we need READ_EXTERNAL_STORAGE
    var permissionNeeded = permissions.READ_MEDIA_AUDIO;

    // Check if we are on an older device
    if (device.platform === 'Android' && parseInt(device.version) < 13) {
        permissionNeeded = permissions.READ_EXTERNAL_STORAGE;
    }

    permissions.checkPermission(permissionNeeded, function(status) {
        if (status.hasPermission) {
            success();
        } else {
            permissions.requestPermission(permissionNeeded, success, error);
        }
    }, error);

    function success() {
        document.getElementById('status').innerText = "Permission Granted! Ready to scan.";
        document.getElementById('status').style.color = "green";
    }

    function error() {
        document.getElementById('status').innerText = "Permission Denied. Please check App Settings.";
        document.getElementById('status').style.color = "red";
    }
}