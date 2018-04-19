// STEP 1 scrape intial data and declare initial variables -----------------------------

// This will be the original array
var copyOfAllWordsArray = [];

// This will record every instance of every word included repeats
var allRecordedInstances = [];

// This will be the array that copyOfAllWordsArray changes to at the end of the process
var uniqueCopyOfAllWordsArray = [];


// Target the timecode that indicates the end of the audio.
// THE FORMAT IS LIKE THIS: '00:00:00'
var endOfAudio = document.querySelectorAll('.timecode')[1].innerText;

var convertedTime = 0;
convertedTime += Number(endOfAudio[7])*1;
convertedTime += Number(endOfAudio[6])*10;
convertedTime += Number(endOfAudio[4])*60;
convertedTime += Number(endOfAudio[3])*1000;
convertedTime += Number(endOfAudio[1])*10000;
convertedTime += Number(endOfAudio[0]) *100000;
endOfAudio = convertedTime;

// GET TITLE OF TRANSCRIPT TEXT IN titleOfTranscript VARIABLE
var titleOfTranscript = document.querySelector('.text--no-wrap').innerText;
// GET ENTIRE TRANSCRIPT TEXT IN fullTranscript VARIABLE
var fullTranscript = document.querySelector('.transcript').innerText;

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



// STEP 2 DECALARE FUNCTIONS THAT WILL BE USED IN SCROLLING INTERVAL -----------------------------------------
function getAttributes ( node ) {
var i,
    attributeNodes = node.attributes,
    length = attributeNodes.length,
    attrs = {};

for ( i = 0; i < length; i++ ) attrs[attributeNodes[i].name] = attributeNodes[i].value;
return attrs;
}

    // Removes duplicates in an array of objects
  function removeDuplicates(originalArray, prop) {
       var newArray = [];
       var lookupObject  = {};

       for(var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
       }

       for(i in lookupObject) {
           newArray.push(lookupObject[i]);
       }
        return newArray;
   }

   var copyToClipboard = function(textToCopy){
    $("body")
        .append($('<input type="text" name="fname" class="textToCopyInput"/>' )
        .val(textToCopy))
        .find(".textToCopyInput")
        .select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        alert('Text copied to clipboard!');
      } catch (err) {
        window.prompt("To copy the text to clipboard: Ctrl+C, Enter", textToCopy);
      }
     $(".textToCopyInput").remove();
}

   function isScrolledIntoView(elem){
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        console.log((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
    }

    function checkIfRowLineIsInView(){
      return isScrolledIntoView(document.querySelectorAll('.row .my-4')[1]);
    }

    function unwrapStringOrNumber(obj) {
        return (obj instanceof Number || obj instanceof String
                ? obj.valueOf()
                : obj);
    }
    function objectsAreEqual(a, b) {
        a = unwrapStringOrNumber(a);
        b = unwrapStringOrNumber(b);
        if (a === b) return true; //e.g. a and b both null
        if (a === null || b === null || typeof (a) !== typeof (b)) return false;
        if (a instanceof Date)
            return b instanceof Date && a.valueOf() === b.valueOf();
        if (typeof (a) !== "object")
            return a == b; //for boolean, number, string, xml

        var newA = (a.areEquivalent_Eq_91_2_34 === undefined),
            newB = (b.areEquivalent_Eq_91_2_34 === undefined);
        try {
            if (newA) a.areEquivalent_Eq_91_2_34 = [];
            else if (a.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === b; })) return true;
            if (newB) b.areEquivalent_Eq_91_2_34 = [];
            else if (b.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === a; })) return true;
            a.areEquivalent_Eq_91_2_34.push(b);
            b.areEquivalent_Eq_91_2_34.push(a);

            var tmp = {};
            for (var prop in a)
                if(prop != "areEquivalent_Eq_91_2_34")
                    tmp[prop] = null;
            for (var prop in b)
                if (prop != "areEquivalent_Eq_91_2_34")
                    tmp[prop] = null;

            for (var prop in tmp)
                if (!objectsAreEqual(a[prop], b[prop]))
                    return false;
            return true;
        } finally {
            if (newA) delete a.areEquivalent_Eq_91_2_34;
            if (newB) delete b.areEquivalent_Eq_91_2_34;
        }
    }





    function getWordObject(word){
    // allInstancesArray will be an array of objects with every instance of the word in the transcript
      var allInstancesArray = [];
      // For every span element
        for(var i = 0; i < allSpans.length;i++){
      // if the span element === the word in param,
      // create all relevant variables for every instance of that word.
          if(allSpans[i].innerHTML === word){
    // getAttributes simply gets value of the attribute passed into it as a string
            var startsAt = Number(getAttributes(allSpans[i-2])["data-from"])/100;
            var endAt = Number(getAttributes(allSpans[i-2])["data-to"])/100;
            var confidence = getAttributes(allSpans[i-2])["class"].replace('word ','');
            var dataKey = Number(getAttributes(allSpans[i-2])["data-key"]);
            var dataOffsetKey = Number(getAttributes(allSpans[i-1])["data-key"]);
            var previousWord = allSpans[i-3].innerHTML.replace(' ','');
            var nextWord = allSpans[i+3].innerHTML.replace(' ','');
            var nextWordObject = {

                  startsAt: Number(getAttributes(allSpans[i+1])["data-from"])/100,
                  endAt: Number(getAttributes(allSpans[i+1])["data-to"])/100,
                  // confidence: getAttributes(allSpans[i+1])["class"].replace('word ',''),
                  dataKey: Number(getAttributes(allSpans[i+1])["data-key"]),
                  dataOffsetKey: Number(getAttributes(allSpans[i+2])["data-key"]),
                  word: nextWord
                }
            var previousWordObject = {
                  startsAt: Number(getAttributes(allSpans[i-5])["data-from"])/100,
                  endAt: Number(getAttributes(allSpans[i-5])["data-to"])/100,
                  // confidence: getAttributes(allSpans[i-5])["class"].replace('word ',''),
                  dataKey: Number(getAttributes(allSpans[i-5])["data-key"]),
                  dataOffsetKey: Number(getAttributes(allSpans[i-4])["data-key"]),
                  word: previousWord
                }
            var isBeginningOfSentence = false;
            var isLastWordInSentence = false;
            // If the previous word contains a '.' then it indicates
            // the current word instance is the beginning of sentence
            if (previousWord.indexOf('.') !== -1) {
              isBeginningOfSentence = true;
            }
            // If the current word contains a '.' then it indicates
            // the current word instance is the end of sentence
            if (word[word.length-1] === '.') {
              isLastWordInSentence = true;
            }


            allInstancesArray.push({
              word:word,
              startsAt: startsAt,
              endAt: endAt,
              confidence: confidence,
              dataKey: dataKey,
              dataOffsetKey: dataOffsetKey,
              previousWord: previousWord,
              nextWord: nextWord,
              isBeginningOfSentence: isBeginningOfSentence,
              isLastWordInSentence:isLastWordInSentence,
              nextWordObject,
              previousWordObject
            })
        }
      }
      copyOfAllWordsArray.push({
        word: word.replace(/\s/g, ""),
        objects: allInstancesArray
      });
      allRecordedInstances.push({
        word: word.replace(/\s/g, ""),
        objects: allInstancesArray
      });
    }

    // getWordObject for every word in the allSpans array
    function getAllWordsTimestamps(){
        for(var i = 0; i < allSpans.length;i++){
          if(allSpans[i].innerHTML[0] === ' '){
          getWordObject(allSpans[i].innerHTML)
        }
      }

    };


    function findAllInstancesOfWord(word){
      var fullObjectArray = [];
      for (var i = 0; i < copyOfAllWordsArray.length; i++) {
        if(word === copyOfAllWordsArray[i].word){
          for (var y = 0; y < copyOfAllWordsArray[i].objects.length; y++) {
            fullObjectArray.push(JSON.stringify(copyOfAllWordsArray[i].objects[y]));
          }
        }
      }
      return Array.from(new Set(fullObjectArray));
    }

    function findAllCorrectArray(){
      for (var i = 0; i < uniqueCopyOfAllWordsArray.length; i++) {
        uniqueCopyOfAllWordsArray[i].objects = findAllInstancesOfWord(uniqueCopyOfAllWordsArray[i].word);
      }
    }

    function parseAllJSONStrings(){
      for (var i = 0; i < uniqueCopyOfAllWordsArray.length; i++) {
        for (var y = 0; y < uniqueCopyOfAllWordsArray[i].objects.length; y++) {
          var parsed = new Function('return ' + uniqueCopyOfAllWordsArray[i].objects[y])();
          uniqueCopyOfAllWordsArray[i].objects[y] = parsed;
        }
      }
    }



//STEP 3 SCROLL THROUGH PAGE AND REPEAT THE INTERVAL CODE WITH setInterval----------------
// THIS PROCESS IS NECESSARY BECAUSE THE PAGE IS A DYNAMIC REACT PAGE --------------------
// OTHERWISE, ONLY A PORTION OF THE WORD TIMESTAMPS WOULD BE EXTRACTED -------------------

// Start at position 100 on page
var scrollPosition = $(window).scrollTop();

// Need to start as null to clearInterval in the future
var scrollInterval = null;

scrollInterval = setInterval(function(){
  // every two seconds position will scroll down by 500.
    scrollPosition += 5000;
    //  300 value is arbitrary.
    window.scrollTo(300, scrollPosition);

    // get an array of all spans in document
    window.allSpans = document.querySelectorAll('span')

    getAllWordsTimestamps();

    // console.log(copyOfAllWordsArray);
    // Since copyOfAllWordsArray will have many duplicates, remove all duplicates.
    uniqueCopyOfAllWordsArray = removeDuplicates(copyOfAllWordsArray,'word');

// IF YOU HAVE SCROLLED TO THE BOTTOM OF THE PAGE STOP THE SCROLLING
    if(checkIfRowLineIsInView()){
        clearInterval(scrollInterval);
        console.log('Finished');
        findAllCorrectArray();
        parseAllJSONStrings();
        copyOfAllWordsArray = uniqueCopyOfAllWordsArray;

        // FINAL STEP COPY JSON


        // ADD TITLE OF VIDEO TO LAST POSITION IN copyOfAllWordsArray
        copyOfAllWordsArray.push(titleOfTranscript);

        // ADD FULL TRANSCRIPT TO LAST POSITION IN copyOfAllWordsArray
        copyOfAllWordsArray.push(fullTranscript);

        // ADD FULL TRANSCRIPT TO FIRST POSITION IN copyOfAllWordsArray
        copyOfAllWordsArray.push(endOfAudio);

        // This is to link each individual word with the correct paragraph
        for(var i = 0; i <= copyOfAllWordsArray.length - 1; i++){
          for(var y = 0; y <= copyOfAllWordsArray[i].objects.length - 1; y++){
            var startsAt = copyOfAllWordsArray[i].objects[y].startsAt;
            for(var z = 0; z < arrayOfTimeStamps.length; z++){
              if(startsAt < arrayOfTimeStamps[z].endsAt && startsAt > arrayOfTimeStamps[z].startsAt){
                // push the paragraph into the relevant word object in copyOfAllWordsArray
                copyOfAllWordsArray[i].objects[y].paragraph =  arrayOfTimeStamps[z];
              }
            }
          }
        }

    }



},500)





// AFTER COPYING THE ABOVE, TYPE THE BELOW SCRIPT. ---------------------------------------------
// copyToClipboard(JSON.stringify(copyOfAllWordsArray));

function finalCommand(){
  copyToClipboard(JSON.stringify(copyOfAllWordsArray));
}
