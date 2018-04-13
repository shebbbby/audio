function getCurrentTimePlayingInAudio(){
  return document.querySelector('audio').currentTime;
}

// NEED TO START AS null TO CLEAR INTERVAL IN FUTURE
var singleWordInterval = null;
function playSingleWord(wordObject){
  clearInterval(singleWordInterval);
  var startTime = wordObject.startsAt;
  var endTime = wordObject.endAt;

  document.querySelector('audio').currentTime = startTime;
  document.querySelector('audio').play();

  singleWordInterval = setInterval(function(){
    // console.log(endTime);
    // console.log(document.querySelector('audio').currentTime);
    if(endTime < document.querySelector('audio').currentTime){
      document.querySelector('audio').pause();
      clearInterval(singleWordInterval);
    }
  },0.1);
}

function playSingleWordWithString(wordString){
  for (var i = 0; i < allWordsArray.length; i++) {
    if(allWordsArray[i].word === wordString){
      playSingleWord(allWordsArray[i].objects[0]);
    }
  }
}

function reduceAudioBy1Millisecond(wordObject, i,y){
  console.log(i,y);
  if (wordObject.endAt - 0.01 > wordObject.startsAt) {
    wordObject.endAt = wordObject.endAt - 0.01;
    // CHANGE BUTTON TO REFLECT THE NEW AUDIO TIME
    document.querySelector('#audioButton-'+i+'-'+y).innerHTML = allWordsArray[i].word+ '['+allWordsArray[i].objects[y].startsAt.toFixed(2)+'-'+allWordsArray[i].objects[y].endAt.toFixed(2)+']'
  }
}
function addAudioBy1Millisecond(wordObject, i,y){
  wordObject.endAt = wordObject.endAt + 0.01;
  // CHANGE BUTTON TO REFLECT THE NEW AUDIO TIME
  document.querySelector('#audioButton-'+i+'-'+y).innerHTML = allWordsArray[i].word+ '['+allWordsArray[i].objects[y].startsAt.toFixed(2)+'-'+allWordsArray[i].objects[y].endAt.toFixed(2)+']'
}


function makeAllUlWordButtons(){
  var ulButtonsHTML = '';
  for (var i = 0; i < allWordsArray.length; i++) {
  var innerButtons = '';
    for (var y = 0; y < allWordsArray[i].objects.length; y++) {
      innerButtons += '<button id="audioButton-'+i+'-'+y+'" onclick="playSingleWord(allWordsArray['+i+'].objects['+y+'])">'+allWordsArray[i].word+ '['+allWordsArray[i].objects[y].startsAt.toFixed(2)+'-'+allWordsArray[i].objects[y].endAt.toFixed(2)+']</button><button id="reduce-'+i+'-'+y+'" onclick="reduceAudioBy1Millisecond('+'allWordsArray['+i+'].objects['+y+']'+','+i+','+y+')" >-</button><button id="add-'+i+'-'+y+'" onclick="addAudioBy1Millisecond('+'allWordsArray['+i+'].objects['+y+']'+','+i+','+y+')" >+</button>'
    }
  ulButtonsHTML += '<li>'+innerButtons+'</li>';
  }
  document.querySelector('#wordButtons').innerHTML = ulButtonsHTML;
}


// makeAllUlWordButtons();

var currentObjectToPushToDatabase = {};
// currentObjectToPushToDatabase.transcript;
// currentObjectToPushToDatabase.audioFile;
// currentObjectToPushToDatabase.originalTimingOfEachWord;
// currentObjectToPushToDatabase.editedTimingOfEachWord;

var currentTranscript;
var titleOfTranscript;
var allWordsArrayTotal = [];

function arraysAreEqual(ary1,ary2){
  return (ary1.join('') == ary2.join(''));
}
// function deleteDuplicatesFromAllWordsArrayTotal(array){
//   if(array.length > 1){
//     for (var i = 0; i < allWordsArrayTotal.length; i++) {
//       if(arraysAreEqual(array,allWordsArrayTotal[i])){
//         allWordsArrayTotal.splice(i,1);
//         return true
//       }
//     }
//   }
//   return false;
// }



function createNewSoundBoard(){
  if(currentAudioFileBeingPlayed
    && document.getElementById('text').value[0] === '['
    && document.getElementById('text').value[1] === '{'){
    eval('allWordsArray = ' + document.getElementById('text').value + ';allWordsArrayTotal.push('+document.getElementById('text').value+')');
    console.log(allWordsArray);

    for (var i = 0; i < allWordsArray.length; i++) {
      allWordsArray[i].transcript = allWordsArray[allWordsArray.length-1],1;
      allWordsArray[i].title = allWordsArray[allWordsArray.length-2],1;
    }

    currentTranscript = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);

    titleOfTranscript = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);

    if(currentAudioFileBeingPlayed[0].name !== titleOfTranscript){
      alert('Audio File Title Does Not Match');
      return;
    }

    document.getElementById('text').value = '';
    document.querySelector('#wordButtons').innerHTML =  '';
    makeAllUlWordButtons();

    // CREATE OBJECT WITH ALL DATA
    currentObjectToPushToDatabase.transcript = currentTranscript;
    currentObjectToPushToDatabase.audioFile = currentAudioFileBeingPlayed;
    currentObjectToPushToDatabase.originalTimingOfEachWord = allWordsArray;
  }else if(
    !(document.getElementById('text').value[0] === '['
  && document.getElementById('text').value[1] === '{')){
    alert('Make sure text has the correct format!');
  }else{
    alert('Upload an audio file first!');
  }
}
