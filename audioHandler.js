var audioFiles = [];
var currentAudioFileBeingPlayed;
function handleFiles(event) {
    event.target.files.arrayOfTimes = [];
    var files = event.target.files;
    audioFiles.push(event.target.files);
    currentAudioFileBeingPlayed = event.target.files;
  	$("#audio").attr("src", URL.createObjectURL(files[0]));
  	document.getElementById("player").load();
    document.getElementById("player").play();
}

document.getElementById("file").addEventListener("change", handleFiles, false);

function playAudioFile(file){
    $("#audio").attr("src", URL.createObjectURL(file[0]));
    document.getElementById("player").load();
    document.getElementById("player").play();
    currentAudioFileBeingPlayed = file;
}
