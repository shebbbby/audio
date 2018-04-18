
function searchInSpecificTranscript(string, transcriptObject){
  var results = searchInMultiSubArray(transcriptObject,string);
  if(results.length > 0){
    return results;
  }else{
    return false;
  }
}

function getTimesOfStringSpecificTranscript(string,transcriptObject){
  var times = searchInSpecificTranscript(string,transcriptObject.transcriptChunkedInOrderAsStrings);
  var arrayOfTimesToReturn = [];
  if(times){
    for (var i = 0; i < times.length; i++) {
      var arrayOfWordObjects = transcriptObject.transcriptChunkedInOrderAsObjects[times[i].iVal][times[i].yVal];
      var length = arrayOfWordObjects.length;
      var startsAt = arrayOfWordObjects[0].startsAt;
      var endsAt = arrayOfWordObjects[length-1].endAt;
      arrayOfTimesToReturn.push({
        startsAt: startsAt,
        endAt:endsAt
      });
    }
  }
  return arrayOfTimesToReturn;
}

function getTimesOfStringAdvancedSpecificTranscript(string, originalString, transcript){
  // SPLIT STRING INTO ARRAY
    var stringArray = string.split(' ');
  // GET ARRAY OF TIMES OF STRING PARAMETER
    var times = getTimesOfStringSpecificTranscript(string,transcript);
  // IF TIMES ARRAY IS EMPTY AND STRINGARRAY IS EMPTY
    if (times.length === 0 && stringArray.length > 0 && stringArray[0] !== '') {
      console.log('stringArray');
      console.log(stringArray);
  // SPLICE THE LAST WORD IN STRINGARRAY
      stringArray.splice(stringArray.length-1,1);
  // JOIN THE RECENTLY SPLICED ARRAY INTO A STRING
      var string = stringArray.join(' ');
  // RECURSIVE... CHECK THE STRING AGAIN WITHOUT THE LAST WORD
      return getTimesOfStringAdvancedSpecificTranscript(string, originalString,transcript);
    }
  // IF THE STRING IS FOUND IN ANY ITERATION, THE FUNCTION IS RETURNED
    else{
      var objectToReturn = {
        originalString: originalString,
        stringFound: string,
        times: times,
        transcriptName: transcript.audioFile[0].name,
        audioFile: transcript.audioFile
      }
      stringsFoundArray.push(string);
      if(string === ''){
        var originalStringArray = originalString.split(' ');
        originalStringArray.splice(0,1);
        var newString = originalStringArray.join(' ');
        return getTimesOfStringAdvancedSpecificTranscript(newString, newString,transcript);
      }
      return objectToReturn;
    }
}

function getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript){
  var stringArray = string.split(' ');
  console.log(transcript.transcriptChunkedInOrderAsStrings);
  if(!searchInSpecificTranscript(stringArray[0],transcript.transcriptChunkedInOrderAsStrings)){
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(0,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript);
  }
  if(!searchInSpecificTranscript(stringArray[stringArray.length-1],transcript.transcriptChunkedInOrderAsStrings)){
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(stringArray.length-1,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript);
  }
  if (string[0] === ' ') {
    string = spliceSlice(string,0,1);
  }
  if (string[string.length-1] === ' ') {
    string = spliceSlice(string,string.length-1,1);
  }
  var initialTimesFound = getTimesOfStringAdvancedSpecificTranscript(string,string,transcript);
  return initialTimesFound;
}

function getMultipleTimesOfStringSpecificTranscript(string,transcript){
  if(string === ''){
    return;
  }
  if (multipleTimesIncrementer === 0) {
    arrayOfTimeObjects = [];
  }
  multipleTimesIncrementer++;
  var object = getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript);
  arrayOfTimeObjects.push(object);
  var originalString = object.originalString;
  var stringFound = object.stringFound;
  var times = object.times;
  var fileName = transcript.audioFile[0].name

  var buttonHtml = [];

  for (var i = 0; i < times.length; i++) {
    buttonHtml.push('<button onclick="playChunkOfAudioWithSpecificAudioFileName('+times[i].startsAt + ',' + times[i].endAt+ ','+'"'+fileName+'"'+')">'+stringFound+'['+times[i].startsAt +'-'+times[i].endAt+']'+'</button><button> - </button><button> + </button><button> X </button>');
  }
  console.log(buttonHtml);
  liHtmlArray.push('<li>'+buttonHtml.join('')+'</li>');

  var newStringToSearch = originalString.replace(stringFound,'');
  if(newStringToSearch[0] === ' '){
    newStringToSearch = spliceSlice(newStringToSearch,0,1);
  }
  if(newStringToSearch.length >= 1){
    return getMultipleTimesOfStringSpecificTranscript(newStringToSearch,transcript);
  }
  multipleTimesIncrementer = 0;
  return arrayOfTimeObjects;
}

function getMultipleTimesOfStringFromAllAudioFiles(string){
  var arrayOfAllResults = [];
  for (var i = 0; i < allTranscriptObjects.length; i++) {
    arrayOfAllResults.push(getMultipleTimesOfStringSpecificTranscript(string,allTranscriptObjects[i]));
  }
  return arrayOfAllResults;
}

function playStringFromAudioFile(string,transcript){
  var times = getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript).times;
  console.log(times);

  if(times.length > 0){
    var randomNumber = Math.floor(Math.random() * times.length);
    console.log(randomNumber)
    if(times[randomNumber] && times[randomNumber].startsAt && times[randomNumber].endAt){
        playAudioFile(transcript.audioFile);
        playChunkOfAudio(times[randomNumber].startsAt,times[randomNumber].endAt);
    }else{
      console.log(times[randomNumber])
    }
  }else{
    console.log(string+' not found');
  }
}

function playChunkOfAudioWithSpecificAudioFileName(beginning,end,fileName){
  clearInterval(singleWordInterval);
  playAudioFileWithFileName(fileName);
  document.querySelector('audio').currentTime = beginning;
  document.querySelector('audio').play();

  singleWordInterval = setInterval(function(){
    // console.log(end);
    // console.log(document.querySelector('audio').currentTime);
    if(end < document.querySelector('audio').currentTime){
      document.querySelector('audio').pause();
      clearInterval(singleWordInterval);
    }
  },0.1);
}
