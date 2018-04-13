// STEP 1
var copyOfAllWordsArray = [];

function getAttributes ( node ) {
var i,
    attributeNodes = node.attributes,
    length = attributeNodes.length,
    attrs = {};

for ( i = 0; i < length; i++ ) attrs[attributeNodes[i].name] = attributeNodes[i].value;
return attrs;
}

  var allSpans = document.querySelectorAll('span')


  function getWordObject(word){
    allInstancesArray = []
      for(var i = 0; i < allSpans.length;i++){
        if(allSpans[i].innerHTML === word){
        var startsAt = Number(getAttributes(allSpans[i-2])["data-from"])/100;
        var endAt = Number(getAttributes(allSpans[i-2])["data-to"])/100;
        var confidence = getAttributes(allSpans[i-2])["class"].replace('word ','');
        var dataKey = Number(getAttributes(allSpans[i-2])["data-key"]);
        var dataOffsetKey = Number(getAttributes(allSpans[i-1])["data-key"]);
        var previousWord = allSpans[i-3].innerHTML.replace(' ','');
        var nextWord = allSpans[i+3].innerHTML.replace(' ','');

        var isBeginningOfSentence = false;
        var isLastWordInSentence = false;
        if (previousWord.indexOf('.') !== -1) {
          isBeginningOfSentence = true;
        }
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
          isLastWordInSentence:isLastWordInSentence
        })
      }
    }
    copyOfAllWordsArray.push({
      word: word.replace(/\s/g, ""),
      objects: allInstancesArray
    });
    return allInstancesArray;
  }

  function getAllWordsTimestamps(){
      for(var i = 0; i < allSpans.length;i++){
        if(allSpans[i].innerHTML[0] === ' '){
        getWordObject(allSpans[i].innerHTML)
      }
    }
  };

  getAllWordsTimestamps();
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

  var copyOfAllWordsArray = removeDuplicates(copyOfAllWordsArray,'word');

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


//STEP 2 SCROLL THROUGH PAGE AND REPEATEDLY PASTE THIS CODE

var scrollPosition = 100;

var scrollInterval = null;

scrollInterval = setInterval(function(){
    scrollPosition += 500;
    window.scrollTo(300, scrollPosition);

    // get an array of all spans in document
    var allSpans = document.querySelectorAll('span')

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

        // Push all variables in allInstancesArray of individual instance
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
              isLastWordInSentence:isLastWordInSentence
            })
        }
      }

      copyOfAllWordsArray.push({
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

    getAllWordsTimestamps();




    // Since copyOfAllWordsArray will have many duplicates, remove all duplicates.
     copyOfAllWordsArray = removeDuplicates(copyOfAllWordsArray,'word');

    if(checkIfRowLineIsInView()){
        clearInterval(scrollInterval);
        console.log('Finished');
        // FINAL STEP COPY JSON

        // ADD TITLE OF VIDEO TO LAST POSITION IN copyOfAllWordsArray
        copyOfAllWordsArray.push(document.querySelector('.text--no-wrap').innerText);

        // ADD FULL TRANSCRIPT TO LAST POSITION IN copyOfAllWordsArray
        copyOfAllWordsArray.push(document.querySelector('.transcript').innerText);

        // Target the timecode that indicates the end of the audio
        var endOfAudio = document.querySelectorAll('.timecode')[1].innerText;

        function endOfAudioConverter(){
            var convertedTime = 0;
            convertedTime += Number(endOfAudio[7])*1;
            convertedTime += Number(endOfAudio[6])*10;
            convertedTime += Number(endOfAudio[4])*60;
            convertedTime += Number(endOfAudio[3])*1000;
            convertedTime += Number(endOfAudio[1])*10000;
            convertedTime += Number(endOfAudio[0]) *100000;
            endOfAudio = convertedTime;
        }

        endOfAudioConverter();

        // GET ENTIRE TRANSCRIPT TEXT IN string VARIABLE
        var string = document.querySelector('.transcript').innerText;

        // Replace all line breaks with '!!!!' so that you can easily split into an array.
        var arrayOfLines = string.replace( /\n/g, "!!!!" ).split( "!!!!" );

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
          var convertedTime = 0;
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

        // This is to link the paragraph with each individual word.
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

},2000)





// AFTER COPYING THE ABOVE, TYPE THE BELOW SCRIPT.
// copyToClipboard(JSON.stringify(copyOfAllWordsArray));
