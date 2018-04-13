// STEP 1
var allWordsArray = [];
var copyOfAllWordsArray = [];
var alreadyUsedAllScraping = false;

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
    // allWordsArray will show what was able to be scraped from the first try.
    if(!alreadyUsedAllScraping){
      allWordsArray.push({
        word: word.replace(/\s/g, ""),
        objects: allInstancesArray
      });
      return allInstancesArray;
    }
    return allInstancesArray;
  }

  function getAllWordsTimestamps(){
      for(var i = 0; i < allSpans.length;i++){
        if(allSpans[i].innerHTML[0] === ' '){
        getWordObject(allSpans[i].innerHTML)
      }
    }
      if(!alreadyUsedAllScraping){
        alreadyUsedAllScraping = true;
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
   // var allWordsArray = removeDuplicates(allWordsArray,'word');
   console.log('allWordsArray');
   console.log(allWordsArray);
   console.log('copyOfAllWordsArray');
   console.log(copyOfAllWordsArray);


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
