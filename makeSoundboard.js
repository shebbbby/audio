function getCurrentTimePlayingInAudio(){
  return document.querySelector('audio').currentTime;
}

// NEED TO START AS null TO CLEAR INTERVAL IN FUTURE
var singleWordInterval = null;

function playSingleWord(wordObject){
  clearInterval(singleWordInterval);
  var startTime = wordObject.startsAt;
  var endTime = wordObject.endAt;

  // CAN SET OFFSET AMOUNT BEFORE entTime to make better timing

  console.log(startTime, endTime);

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


// playChunkOfAudio(5,10, function(){playChunkOfAudio(15,20)})
function playChunkOfAudio(beginning,end,callback){
  clearInterval(singleWordInterval);
  document.querySelector('audio').currentTime = beginning;
  document.querySelector('audio').play();

  singleWordInterval = setInterval(function(){
    // console.log(end);
    // console.log(document.querySelector('audio').currentTime);
    if(end < document.querySelector('audio').currentTime){
      document.querySelector('audio').pause();
      clearInterval(singleWordInterval);
      if(callback){
        callback();
      }
    }
  },0.1);
}

// ------------------------------------------------------------------------------
audioLinkArray = [];
function addToAudioLinkArray(beginning,end){
  stringToAdd = 'playChunkOfAudio('+beginning+','+end+',function(){console.log("FINISHED")})';
  audioLinkArray.push(stringToAdd);
}


function linkAudioLinkArray(){
  // CREATE CLONE OF AUDIOLINKARRAY
  var audioLinkArray2 = JSON.parse(JSON.stringify(audioLinkArray));
  for (var i = 0; i < audioLinkArray.length; i++) {
    if (audioLinkArray2[i + 1]) {
      audioLinkArray2[i] = audioLinkArray2[i].replace('console.log("FINISHED")',audioLinkArray2[i+1]);
      audioLinkArray2.splice(i+1,1);
      i -= 1;
    }
  }
  return audioLinkArray2.join('');
}
// ------------------------------------------------------------------------------

function getObjectsOfWordIfExists(word){
  var arrayOfWord
  for (var i = 0; i < allWordsArray.length; i++) {
    if(word === allWordsArray[i].word){
      return allWordsArray[i].objects;
    }
  }
  return false;
}

function playIndividualWord(word, version){
  var objects = getObjectsOfWordIfExists(word);

  if(objects){
    var objectsLength = objects.length;
      if(version){
        playChunkOfAudio(objects[version].startsAt,objects[version].endAt);
      }else{
        var randomNumber = Math.floor(Math.random() * objectsLength);
        playChunkOfAudio(objects[randomNumber].startsAt,objects[randomNumber].endAt);
      }
  }
}

function checkIfNextWordIsCorrect(word1,word2){

  var word1Objects = getObjectsOfWordIfExists(word1);
  var word2bjects = getObjectsOfWordIfExists(word2);
  for (var i = 0; i < word1Objects.length; i++) {
    if (word1Objects[i].nextWord === word2) {
      console.log('words go together');
      return {
        startsAt: word1Objects[i].startsAt,
        endAt: word1Objects[i].nextWordObject.endAt
      };
    }
  }
  return false;
}

function getrandomTimingOfWord(word){
  var wordObjects = getObjectsOfWordIfExists(word);
  var randomNumber = Math.floor(Math.random() * wordObjects.length);
    return {
      startsAt: wordObjects[randomNumber].startsAt,
      endAt: wordObjects[randomNumber].endAt
  }
}


function checkIfPriorStringComesBefore(string, word){
    if(currentTranscript.toLowerCase().indexOf(string + ' ' + word) !== -1){
      return true;
  }else{
    return false;
  }
}


function getMultipleRandomTimingOfWord(string){
  var arrayOfWords = string.split(' ');
  var arrayOfTimes = [];
  for (var i = 0; i < arrayOfWords.length; i++) {
    var checkIfTwoWordsGoTogether = checkIfNextWordIsCorrect(arrayOfWords[i],arrayOfWords[i+1]);
    if(checkIfTwoWordsGoTogether){
      arrayOfTimes.push({
        word: arrayOfWords[i] + ' ' + arrayOfWords[i+1],
        startsAt: checkIfTwoWordsGoTogether.startsAt,
        endAt: checkIfTwoWordsGoTogether.endAt
      })
      arrayOfWords[i] = arrayOfWords[i] + ' ' + arrayOfWords[i+1];
    }

    else if(getObjectsOfWordIfExists(arrayOfWords[i])){
      var times = getrandomTimingOfWord(arrayOfWords[i]);
      arrayOfTimes.push({
        word: arrayOfWords[i],
        startsAt: times.startsAt,
        endAt: times.endAt
      })
    }
  }
  return arrayOfTimes;
}


// function combineWords(array){
//   for (var i = 0; i < array.length-1; i++) {
//     if(array[i].endAt > array[i+1].startsAt && array[i+1].startsAt > array[i].startsAt){
//       array[i] = {word: array[i].word, startsAt: array[i].startsAt, endAt: array[i+1].endAt, word2:array[i+1].word}
//     }
//     else if(array[i-1] && array[i-1].word2 && array[i-1].word2 === array[i].word){
//       array.splice(i,1);
//       i -=1;
//     }
//   }
// }


// Get array of every index of substring within string
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function checkIfStringIsSubstringOfRawTranscript(string){
  if(rawTranscript.indexOf(string) !== -1){
    var indices = getIndicesOf(string, rawTranscript);
    return indices;
  }else{
    return false;
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







// ----------------------------------------------------

function chunk (arr, len) {

  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

//  So if the string was 'abc' you could have [a, ab, abc, b, ba, bac etc...]
function getAllSubstrings(str) {
  var i, j, result = [];

  for (i = 0; i < str.length; i++) {
      for (j = i + 1; j < str.length + 1; j++) {
          result.push(str.slice(i, j));
      }
  }
  return result;
}

function getAllSubArrays(array) {
  var i, j, result = [];

  for (i = 0; i < array.length; i++) {
      for (j = i + 1; j < array.length + 1; j++) {
          result.push(array.slice(i, j));
      }
  }
  return result;
}

function getAllSubArraysForAllParagraphs(){
  var subArrays = [];
  for (var i = 0; i < currentObjectToPushToDatabase.paragraphTiming.length; i++) {
    var splitArray = currentObjectToPushToDatabase.paragraphTiming[i].paragraph.split(' ');
    subArrays.push(getAllSubArrays(splitArray));
  }
  return subArrays;
}

function getAllSubArraysForAllSentences(){
  var subArrays = [];
  var arrayOfAllSentences = rawTranscript.split('.');
  for (var i = 0; i < arrayOfAllSentences.length; i++) {
    var splitArray = arrayOfAllSentences[i].split(' ');
    subArrays.push(getAllSubArrays(splitArray));
  }
  return subArrays;
}




function advancedObjectSplice(){
  var objectWordsInOrderArray = getAllWordObjectsInAlphabeticOrder();
  var overallArray = [];
  var arrayToPushObjectsInto = [];
  for (var i = 0; i < objectWordsInOrderArray.length; i++) {
    var word = objectWordsInOrderArray[i].word;
        arrayToPushObjectsInto.push(objectWordsInOrderArray[i]);
    if(word.indexOf('.') !== -1){
      overallArray.push(arrayToPushObjectsInto);
      arrayToPushObjectsInto = [];
    }
  }
  return overallArray;
}

function advancedObjectSpliceSTRING(){
  var objectWordsInOrderArray = getAllWordObjectsInAlphabeticOrder();
  var correctTranscriptArray = [];

  for (var i = 0; i < objectWordsInOrderArray.length; i++) {
    correctTranscriptArray.push(objectWordsInOrderArray[i].word.replace(/\s+/g, ""));
  }

  var stringWordsInOrderArray = correctTranscriptArray;
  var overallArray = [];
  var arrayToPushStringsInto = [];
  for (var i = 0; i < stringWordsInOrderArray.length; i++) {
    var word = stringWordsInOrderArray[i];
        arrayToPushStringsInto.push(stringWordsInOrderArray[i]);
    if(word.indexOf('.') !== -1){
      overallArray.push(arrayToPushStringsInto);
      arrayToPushStringsInto = [];
    }
  }


  return overallArray;
}







// ----------------------------------------------------
function getAllSubArraysForChunkedTranscript(array){
  var subArrays = [];
  for (var i = 0; i < array.length; i++) {
    subArrays.push(getAllSubArrays(array[i]));
  }
  return subArrays;
}

function getAllWordObjectsInAlphabeticOrder(){
  var arrayOfAllIndividualObjects = [];
  var transcriptTextHTML = '';
  rawTranscript = [];
  for (var i = 0; i < allWordsArray.length; i++) {
    for (var y = 0; y < allWordsArray[i].objects.length; y++) {
      arrayOfAllIndividualObjects.push(allWordsArray[i].objects[y]);
    }
  }
    arrayOfAllIndividualObjects.sort(function(a, b) {
      return a.startsAt - b.startsAt;
  })
  for (var i = 0; i < arrayOfAllIndividualObjects.length; i++) {
    arrayOfAllIndividualObjects[i].wordNumber = i;
    transcriptTextHTML += '<span id="span-word-'+arrayOfAllIndividualObjects[i].word.replace(/\s+/g, "")+'">'+arrayOfAllIndividualObjects[i].word+'</span>';
    rawTranscript.push(arrayOfAllIndividualObjects[i].word.replace(/\s+/g, ""));
  }
  var rawTranscript = rawTranscript.join(' ');
  rawTranscriptArray = rawTranscript.split(' ');
  document.querySelector('#transcript-text').innerHTML = transcriptTextHTML;
  return arrayOfAllIndividualObjects;
}

// splice a string;
function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}


function searchInMultiSubArray(array,string){
  var resultsArray = [];
  for (var i = 0; i < array.length; i++) {
    for (var y = 0; y < array[i].length; y++) {

      // IF STARTS WITH OR ENDS WITH SPACE--------------
      if(string[0] === ' '){
        string = spliceSlice(string,0,1);
      }
      if(string[string.length-1] === ' '){
        string = spliceSlice(string,string.length-1,1);
      }
      // -----------------------------------------------
      var stringValue = string.toLowerCase().replace(/'/g, '').replace('.', '');
      var compareValue = array[i][y].join(' ').toLowerCase().replace(/'/g, '').replace('.', '')

      if (stringValue === compareValue) {
        resultsArray.push({iVal:i,yVal:y});
      }
    }
  }
  return resultsArray;
}


// --------------------------------------

function searchInTranscriptChunkedInOrderAsStrings(string){
  var results = searchInMultiSubArray(transcriptChunkedInOrderAsStrings,string);
  if(results.length > 0){
    return results;
  }else{
    return false;
  }
}

// ----------------------------------------------------------------
function searchInSpecificTranscript(string, transcriptObject){
  var results = searchInMultiSubArray(transcriptObject,string);
  if(results.length > 0){
    return results;
  }else{
    return false;
  }
}
// ----------------------------------------------------------------

function getTimesOfString(string){
  var times = searchInTranscriptChunkedInOrderAsStrings(string);
  var arrayOfTimesToReturn = [];
  if(times){
    for (var i = 0; i < times.length; i++) {
      var arrayOfWordObjects = transcriptChunkedInOrderAsObjects[times[i].iVal][times[i].yVal];
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
// ----------------------------------------------------------------
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
// ----------------------------------------------------------------


function getTimesOfStringAdvanced(string, originalString){
  // SPLIT STRING INTO ARRAY
    var stringArray = string.split(' ');
  // GET ARRAY OF TIMES OF STRING PARAMETER
    var times = getTimesOfString(string);
  // IF TIMES ARRAY IS EMPTY AND STRINGARRAY IS EMPTY
    if (times.length === 0 && stringArray.length > 0 && stringArray[0] !== '') {
      console.log('stringArray');
      console.log(stringArray);
  // SPLICE THE LAST WORD IN STRINGARRAY
      stringArray.splice(stringArray.length-1,1);
  // JOIN THE RECENTLY SPLICED ARRAY INTO A STRING
      var string = stringArray.join(' ');
  // RECURSIVE... CHECK THE STRING AGAIN WITHOUT THE LAST WORD
      return getTimesOfStringAdvanced(string, originalString);
    }
  // IF THE STRING IS FOUND IN ANY ITERATION, THE FUNCTION IS RETURNED
    else{
      var objectToReturn = {
        originalString: originalString,
        stringFound: string,
        times: times
      }
      if(string === ''){
        var originalStringArray = originalString.split(' ');
        originalStringArray.splice(0,1);
        var newString = originalStringArray.join(' ');
        return getTimesOfStringAdvanced(newString, newString);
      }
      return objectToReturn;
    }
}
// ----------------------------------------------------------------
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
      if(string === ''){
        var originalStringArray = originalString.split(' ');
        originalStringArray.splice(0,1);
        var newString = originalStringArray.join(' ');
        return getTimesOfStringAdvancedSpecificTranscript(newString, newString,transcript);
      }
      return objectToReturn;
    }
}
// ----------------------------------------------------------------


function getTimesOfStringEvenMoreAdvanced(string){
  var stringArray = string.split(' ');
  if(!searchInTranscriptChunkedInOrderAsStrings(stringArray[0])){
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(0,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvanced(string);
  }
  if(!searchInTranscriptChunkedInOrderAsStrings(stringArray[stringArray.length-1])){
    if (stringArray.length <= 1) {
      return;
    }
    stringArray.splice(stringArray.length-1,1);
    string = stringArray.join(' ');
    return getTimesOfStringEvenMoreAdvanced(string);
  }
  if (string[0] === ' ') {
    string = spliceSlice(string,0,1);
  }
  if (string[string.length-1] === ' ') {
    string = spliceSlice(string,string.length-1,1);
  }
  var initialTimesFound = getTimesOfStringAdvanced(string,string);
  return initialTimesFound;
}
// ----------------------------------------------------------------
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
// ----------------------------------------------------------------


var liHtmlArray = [];
var multipleTimesIncrementer = 0;

function getMultipleTimesOfString(string){
  if(string === ''){
    return;
  }
  if (multipleTimesIncrementer === 0) {
    arrayOfTimeObjects = [];
  }
  multipleTimesIncrementer++;
  var object = getTimesOfStringEvenMoreAdvanced(string);
  arrayOfTimeObjects.push(object);
  var originalString = object.originalString;
  var stringFound = object.stringFound;
  var times = object.times;

  var buttonHtml = '';
  var buttonHtml = [];


  for (var i = 0; i < times.length; i++) {
    var currentLiHtmlLength = liHtmlArray.length;
    buttonHtml.push('<span id="playCustomChunkSpan-'+currentLiHtmlLength+'-'+i+'"><button class="playChunk" id="playCustomChunk-'+currentLiHtmlLength+'-'+i+'" onclick="playChunkOfAudio('+times[i].startsAt + ',' + times[i].endAt+')">'+stringFound+'[<span class="timeChunk">'+times[i].startsAt +'-'+times[i].endAt+'</span>]'+'</button><button class="reduceChunk" onclick="reduceChunkOfAudioBy10Miliseconds('+currentLiHtmlLength+','+i+')"> - </button><button class="increaseChunk" onclick="increaseChunkOfAudioBy10Miliseconds('+currentLiHtmlLength+','+i+')"> + </button><button class="deleteChunk" onclick="removeWithinCustomUlButtons('+currentLiHtmlLength+','+i+')"> X </button><button class="addToAudioLinkButton" onclick="addToAudioLinkArray('+times[i].startsAt + ',' + times[i].endAt+')">ADD</button></span>');
  }
  console.log(buttonHtml);
  liHtmlArray.push(buttonHtml);

  var newStringToSearch = originalString.replace(stringFound,'');
  if(newStringToSearch[0] === ' '){
    newStringToSearch = spliceSlice(newStringToSearch,0,1);
  }
  if(newStringToSearch.length >= 1){
    return getMultipleTimesOfString(newStringToSearch);
  }
  multipleTimesIncrementer = 0;
  return arrayOfTimeObjects;
}


// ----------------------------------------------------------------
// function getMultipleTimesOfStringSpecificTranscript(string,transcript){
//   if(string === ''){
//     return;
//   }
//   if (multipleTimesIncrementer === 0) {
//     arrayOfTimeObjects = [];
//   }
//   multipleTimesIncrementer++;
//   var object = getTimesOfStringEvenMoreAdvancedSpecficTranscript(string,transcript);
//   arrayOfTimeObjects.push(object);
//   var originalString = object.originalString;
//   var stringFound = object.stringFound;
//   var times = object.times;
//   var fileName = transcript.audioFile[0].name
//
//   var buttonHtml = [];
//
//   for (var i = 0; i < times.length; i++) {
//     buttonHtml.push('<button onclick="playChunkOfAudioWithSpecificAudioFileName('+times[i].startsAt + ',' + times[i].endAt+ ','+'"'+fileName+'"'+')">'+stringFound+'['+times[i].startsAt +'-'+times[i].endAt+']'+'</button><button> - </button><button> + </button><button> X </button>');
//   }
//   console.log(buttonHtml);
//   liHtmlArray.push('<li>'+buttonHtml.join('')+'</li>');
//
//   var newStringToSearch = originalString.replace(stringFound,'');
//   if(newStringToSearch[0] === ' '){
//     newStringToSearch = spliceSlice(newStringToSearch,0,1);
//   }
//   if(newStringToSearch.length >= 1){
//     return getMultipleTimesOfStringSpecificTranscript(newStringToSearch,transcript);
//   }
//   multipleTimesIncrementer = 0;
//   return arrayOfTimeObjects;
// }



// ----------------------------------------------------------------

function getMultipleTimesOfStringFromAllAudioFiles(string){
  var arrayOfAllResults = [];
  for (var i = 0; i < allTranscriptObjects.length; i++) {
    arrayOfAllResults.push(getMultipleTimesOfStringSpecificTranscript(string,allTranscriptObjects[i]));
  }
  return arrayOfAllResults;
}
// ----------------------------------------------------------------


function createCustomButtons(){
  getMultipleTimesOfString(document.querySelector('#customWordButtonsTextarea').value);

  document.querySelector('#customWordButtonsTextarea').value = '';
  var innerUlHtml = '';
  for (var i = 0; i < liHtmlArray.length; i++) {
    innerUlHtml += '<li>'
    for (var y = 0; y < liHtmlArray[i].length; y++) {
      innerUlHtml += liHtmlArray[i][y];
    }
    innerUlHtml += '</li>'
  }
  document.querySelector('#customWordButtons').innerHTML = innerUlHtml;
}



function removeWithinCustomUlButtons(i,y){
  if(liHtmlArray[i][y+1]){
    for (var z = y+1; z < liHtmlArray[i].length; z++) {
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('playCustomChunk-'+i+'-'+z+'','playCustomChunk-'+i+'-'+(z-1));
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('playCustomChunkSpan-'+i+'-'+z+'','playCustomChunkSpan-'+i+'-'+(z-1));
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('removeWithinCustomUlButtons('+i+','+z+')', 'removeWithinCustomUlButtons('+i+','+(z-1)+')');
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('reduceChunkOfAudioBy10Miliseconds('+i+','+z+')', 'reduceChunkOfAudioBy10Miliseconds('+i+','+(z-1)+')');
      liHtmlArray[i][z] = liHtmlArray[i][z].replace('increaseChunkOfAudioBy10Miliseconds('+i+','+z+')', 'increaseChunkOfAudioBy10Miliseconds('+i+','+(z-1)+')');
    }
  }
  liHtmlArray[i].splice(y,1);
  if(liHtmlArray[i].length === 0){
    liHtmlArray.splice(i,1);
  }
  createCustomButtons();
}

function reduceChunkOfAudioBy10Miliseconds(i,y){
  var times = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML.split('-');

  times[0] = Number(times[0]);
  times[1] = Number(times[1]);

  times[1] -= 0.01;

  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML = times[0].toFixed(2) + '-' + times[1].toFixed(2);
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).onclick = function(){playChunkOfAudio(times[0],times[1])}
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > .addToAudioLinkButton').onclick = function(){ addToAudioLinkArray(times[0],times[1]); }


  addToAudioLinkArray
}
function increaseChunkOfAudioBy10Miliseconds(i,y){
  var times = document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML.split('-');

  times[0] = Number(times[0]);
  times[1] = Number(times[1]);

  times[1] += 0.01;

  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y+' .timeChunk').innerHTML = times[0].toFixed(2) + '-' + times[1].toFixed(2);
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > #playCustomChunk-'+i+'-'+y).onclick = function(){playChunkOfAudio(times[0],times[1])}
  document.querySelector('#playCustomChunkSpan-'+i+'-'+y+' > .addToAudioLinkButton').onclick = function(){ addToAudioLinkArray(times[0],times[1]); }

}

document.querySelector('#customWordButtonsTextarea').value = '';





function playString(string){
  var times = getTimesOfStringEvenMoreAdvanced(string).times;
  console.log(times)

  if(times.length > 0){
    var randomNumber = Math.floor(Math.random() * times.length);
    console.log(randomNumber)
    if(times[randomNumber] && times[randomNumber].startsAt && times[randomNumber].endAt){
        playChunkOfAudio(times[randomNumber].startsAt,times[randomNumber].endAt);
    }else{
      console.log(times[randomNumber])
    }
  }else{
    console.log(string+' not found');
  }
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





function playStringTextInput(){
  playString(document.querySelector('#playStringTextInput').value);
  document.querySelector('#playStringTextInput').value = '';
}













var currentObjectToPushToDatabase = {};
var currentTranscript;
var titleOfTranscript;
var allWordsArrayTotal = [];

function arraysAreEqual(ary1,ary2){
  return (ary1.join('') == ary2.join(''));
}



var allTranscriptObjects = [];
function getArrayOfTimeStamps(fullTranscript, endOfAudio){
  // Replace all line breaks with '!!!!' so that you can easily split into an array.
  var arrayOfLines = fullTranscript.replace( /\n/g, "!!!!" ).split( "!!!!" );
  // arrayOfTimeStamps will be an array of objects
  var arrayOfTimeStamps = [];

  for(var i = 0; i <=  arrayOfLines.length - 1; i++){
  // If a line has 8 ('00:00:00') or 17 ('00:00:00PlayPause') characters,
    // it indicates that the line is a timestamp line
    if(arrayOfLines[i].length === 8 || arrayOfLines[i].length === 17){
      // Push those lines and the next paragraph into arrayOfTimeStamps
      arrayOfTimeStamps.push({
        timestamp: arrayOfLines[i].replace('PlayPause',''),
        paragraph: arrayOfLines[i+1]
      })
    }
  }

  // Get the convertedTime of paragraphs, because they need to be comparable to the individual words.
  for(var i = 0; i <=  arrayOfTimeStamps.length - 1; i++){
  let convertedTime = 0;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[7])/1;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[6])*10;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[4])*60;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[3])*1000;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[1])*10000;
    convertedTime += Number(arrayOfTimeStamps[i].timestamp[0])*100000;
    arrayOfTimeStamps[i].startsAt = convertedTime;
  }

  // Get when the paragraph ends.
  for(var i = 0; i <=  arrayOfTimeStamps.length - 1; i++){
    if(arrayOfTimeStamps[i+1]){
      arrayOfTimeStamps[i].endsAt = arrayOfTimeStamps[i+1].startsAt;
    }else{
      // For the last paragraph, the endsAt value will be the end of the audio
      arrayOfTimeStamps[i].endsAt = endOfAudio;
    }
  }
  return arrayOfTimeStamps;
}


// The raw transcript without any extra stuff
var rawTranscript;

var transcriptChunkedInOrderAsObjects;
var transcriptChunkedInOrderAsStrings;



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

    endOfAudio = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);

    currentTranscript = allWordsArray[allWordsArray.length-1];
    document.querySelector('#transcript-text').innerHTML = currentTranscript;
    allWordsArray.splice(allWordsArray.length-1,1);

    titleOfTranscript = allWordsArray[allWordsArray.length-1];
    allWordsArray.splice(allWordsArray.length-1,1);


    // replace all spaces ' ' and hyphens '-' with '' so that it avoids any confusion.
    if(currentAudioFileBeingPlayed[0].name.replace(/\s+/g, "").replace(/-/g, '') !== titleOfTranscript.replace(/\s+/g, "-").replace(/-/g, '')){
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
    currentObjectToPushToDatabase.paragraphTiming = getArrayOfTimeStamps(currentTranscript, endOfAudio);


    rawTranscript = currentTranscript.replace(/\(.*?\)/g, '');

    var arrayOfLines = rawTranscript.replace( /\n/g, "!!!!" ).split( "!!!!" );

    for(var i = arrayOfLines.length - 1; i >=  0; i--){
    // If a line has 8 ('00:00:00') or 17 ('00:00:00PlayPause') characters,
      // it indicates that the line is a timestamp line
      if(arrayOfLines[i].length === 8 || arrayOfLines[i].length === 17 || arrayOfLines[i] === ''|| arrayOfLines[i] === ' '){
        // Push those lines and the next paragraph into arrayOfTimeStamps
        arrayOfLines.splice(i,1)
      }
    }


    rawTranscript = arrayOfLines.toString().replace(`×,Easily edit this transcript,Sonix has created the world's first AudioText Editor™—it stitches the audio to text and works like a word processor in your browser. Click on a word below and start typing. Hit enter to break apart who said what.,`,'').replace(/,/g, " ");
    currentObjectToPushToDatabase.rawTranscript = rawTranscript;
    document.querySelector('#transcript-text').innerHTML = rawTranscript;
    rawTranscriptArray = rawTranscript.split(' ');
    currentObjectToPushToDatabase.rawTranscriptArray = rawTranscriptArray;

    // var xxx = getAllWordObjectsInAlphabeticOrder()
    // transcriptChunkedInOrderAsStrings = getAllSubArraysForAllSentences();
    // transcriptChunkedInOrderAsStrings =  getAllSubArraysForChunked10Array();
    // transcriptChunkedInOrderAsObjects = getAllSubArraysForChunkedTranscript(chunk(xxx,10));

    transcriptChunkedInOrderAsStrings = getAllSubArraysForChunkedTranscript(advancedObjectSpliceSTRING());
    transcriptChunkedInOrderAsObjects = getAllSubArraysForChunkedTranscript(advancedObjectSplice());
    currentObjectToPushToDatabase.transcriptChunkedInOrderAsStrings = transcriptChunkedInOrderAsStrings;
    currentObjectToPushToDatabase.transcriptChunkedInOrderAsObjects = transcriptChunkedInOrderAsObjects;



    allTranscriptObjects.push({
      transcriptChunkedInOrderAsStrings: transcriptChunkedInOrderAsStrings,
      transcriptChunkedInOrderAsObjects: transcriptChunkedInOrderAsObjects,
      audioFile: currentAudioFileBeingPlayed
    });
  }else if(
    !(document.getElementById('text').value[0] === '['
  && document.getElementById('text').value[1] === '{')){
    alert('Make sure text has the correct format!');
  }else{
    alert('Upload an audio file first!');
  }
}
