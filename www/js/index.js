document.addEventListener('deviceready', onDeviceReady, false);

var currentMedia = null;

function onDeviceReady() {
    var permissions = cordova.plugins.permissions;
    var permissionNeeded = (device.platform === 'Android' && parseInt(device.version) >= 13) 
                            ? permissions.READ_MEDIA_AUDIO 
                            : permissions.READ_EXTERNAL_STORAGE;

    permissions.checkPermission(permissionNeeded, function(status) {
        if (status.hasPermission) {
            startScanning();
        } else {
            permissions.requestPermission(permissionNeeded, startScanning, function() {
                document.getElementById('status').innerText = "Permission Denied";
            });
        }
    }, null);
}

function startScanning() {
    document.getElementById('status').innerText = "Scanning Music Folder...";
    
    // We look specifically in the /Music folder
    var path = cordova.file.externalRootDirectory + "Music/";
    
    window.resolveLocalFileSystemURL(path, function(dirEntry) {
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function(entries) {
            displaySongs(entries);
        }, function(err) {
            document.getElementById('status').innerText = "Error reading folder";
        });
    }, function(err) {
        document.getElementById('status').innerText = "Music folder not found";
    });
}

function displaySongs(entries) {
    var list = document.getElementById('file-list');
    list.innerHTML = ""; // Clear the "Searching..." text
    var foundCount = 0;

    entries.forEach(function(entry) {
        if (entry.isFile && entry.name.toLowerCase().endsWith('.mp3')) {
            foundCount++;
            var div = document.createElement('div');
            div.className = 'song-item';
            div.innerHTML = `
                <span>${entry.name}</span>
                <button onclick="playSong('${entry.nativeURL}')">Play</button>
            `;
            list.appendChild(div);
        }
    });

    if (foundCount === 0) {
        document.getElementById('status').innerText = "No MP3s found in Music folder";
    } else {
        document.getElementById('status').innerText = "Found " + foundCount + " songs";
    }
}

function playSong(url) {
    if (currentMedia) {
        currentMedia.stop();
        currentMedia.release();
    }
    
    currentMedia = new Media(url, function() {
        console.log("Finished playing");
    }, function(err) {
        alert("Error playing: " + JSON.stringify(err));
    });
    
    currentMedia.play();
    document.getElementById('status').innerText = "Now Playing...";
}