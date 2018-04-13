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
    console.log(arrayOfTimeStamps[i].timestamp);
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

// Turn copyOfAllWordsArray into a string so that you can copy it
JSON.stringify(copyOfAllWordsArray)
