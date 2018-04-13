//STEP 2 SCROLL THROUGH PAGE AND REPEATEDLY PASTE THIS CODE

    var allSpans = document.querySelectorAll('span')

    function getWordObject(word){
      var allInstancesArray = [];
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
    }

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

      var copyOfAllWordsArray = removeDuplicates(copyOfAllWordsArray,'word');
     console.log('allWordsArray');
     console.log(allWordsArray);
     console.log('copyOfAllWordsArray');
     console.log(copyOfAllWordsArray);
