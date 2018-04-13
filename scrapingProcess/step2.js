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
      // allWordsArray.sort(function(a, b) {
      //  return a.word.localeCompare(b.word);
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
     // Since copyOfAllWordsArray will have many duplicates, remove all duplicates.
      var copyOfAllWordsArray = removeDuplicates(copyOfAllWordsArray,'word');
     console.log('allWordsArray');
     console.log(allWordsArray);
     console.log('copyOfAllWordsArray');
     console.log(copyOfAllWordsArray);
