function searchWordInThesaurus(word,number) {
	$.ajax({
		url: 'https://www.dictionaryapi.com/api/v1/references/thesaurus/xml/' + word + '?key=86ea0d7a-789f-4a53-ba9d-1303f3cbf6ae',
		method: "GET",
		success: function (response) {
      var wordArray = [];
			var definitionVersionNumbers = response.querySelectorAll('sens').length;
			console.log(definitionVersionNumbers)
			for (var i = 0; i < definitionVersionNumbers; i++) {
				var word = response.querySelector('hw').innerHTML;
				var partOfSpeech = response.querySelector('fl').innerHTML;
				var definition = response.querySelectorAll('sens')[i].querySelector('mc').innerHTML;
				var sentence = response.querySelectorAll('sens')[i].querySelector('vi').innerHTML;
				var wordUsedInASentence = response.querySelectorAll('sens')[i].querySelector('vi > it').innerHTML;
				if (response.querySelectorAll('sens')[i].querySelector('syn')) {
						var synonyms = response.querySelectorAll('sens')[i].querySelector('syn').innerHTML.split(',');
				}
				if (response.querySelectorAll('sens')[i].querySelector('ant')) {
					var antonyms = response.querySelectorAll('sens')[i].querySelector('ant').innerHTML.split(',');
				}
				if (response.querySelectorAll('sens')[i].querySelector('ant')) {
					var relatedWords = response.querySelectorAll('sens')[i].querySelector('rel').innerHTML.split(',');
				}
				var objectToPush = {
					word:word,
					partOfSpeech:partOfSpeech,
					definition:definition,
					sentence:sentence,
					wordUsedInASentence:wordUsedInASentence,
					synonyms:synonyms,
					relatedWords:relatedWords
				}
				wordArray.push(objectToPush);
			}
			console.log(wordArray);

			if (number || number === 0) {
				var allHtml = '';
				for (var i = 0; i < wordArray.length; i++) {
					var synonymsArray = wordArray[i].synonyms;
					var htmlSpanButtons = '';
					for (var y = 0; y < synonymsArray.length; y++) {
						htmlSpanButtons += '<button onclick=enterStringIntoTextarea("'+synonymsArray[y].replace(' ','')+'")>'+synonymsArray[y]+'</button>'
					}
					allHtml +='<span> Synonyms:' + htmlSpanButtons + '</span><hr>'
				}

				document.querySelectorAll('.stringNotFound')[number].nextSibling.nextSibling.innerHTML = allHtml;
			}


  },
		error: function (err) {
			console.log(err);
		}
	})
}

function makeAllSynonymButtons(){
	for (var i = 0; i < document.querySelectorAll('.stringNotFound > button').length; i++) {
		searchWordInThesaurus(document.querySelectorAll('.stringNotFound > button')[i].innerHTML,i);
	}
}

function enterStringIntoTextarea(string){
	document.querySelector('#customWordButtonsTextarea').value = string;
	document.querySelector('#createCustomButtonsButton').click();
}
