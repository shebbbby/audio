// FINAL STEP COPY JSON

// ADD FULL TRANSCRIPT TO LAST POSITION IN ARRAY
copyOfAllWordsArray.push(document.querySelector('.text--no-wrap').innerText);
copyOfAllWordsArray.push(document.querySelector('.transcript').innerText);

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


var string = document.querySelector('.transcript').innerText;

var numberOfLineBreaks = (string.match(/\n/g)||[]).length;
var arrayOfLines = string.replace( /\n/g, "!!!!" ).split( "!!!!" );

var arrayOfTimeStamps = [];

for(var i = 0; i <=  arrayOfLines.length - 1; i++){
  if(arrayOfLines[i].length === 8 || arrayOfLines[i].length === 17){
    arrayOfTimeStamps.push({
      timestamp: arrayOfLines[i].replace('PlayPause',''),
      paragraph: arrayOfLines[i+1]
    })
  }
}



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

for(var i = 0; i <=  arrayOfTimeStamps.length - 1; i++){
    if(arrayOfTimeStamps[i+1]){
      arrayOfTimeStamps[i].endsAt = arrayOfTimeStamps[i+1].startsAt;
    }else{
      arrayOfTimeStamps[i].endsAt = endOfAudio;
    }
  }

for(var i = 0; i <= copyOfAllWordsArray.length - 1; i++){
  for(var y = 0; y <= copyOfAllWordsArray[i].objects.length - 1; y++){
    var startsAt = copyOfAllWordsArray[i].objects[y].startsAt;
    for(var z = 0; z < arrayOfTimeStamps.length; z++){
      if(startsAt < arrayOfTimeStamps[z].endsAt && startsAt > arrayOfTimeStamps[z].startsAt){
        copyOfAllWordsArray[i].objects[y].paragraph =  arrayOfTimeStamps[z];
      }
    }
  }
}

JSON.stringify(copyOfAllWordsArray)
