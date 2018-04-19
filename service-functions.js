// GET STRING VERSION OF HTML
document.getHTML= function(who, deep){
    if(!who || !who.tagName) return '';
    var txt, ax, el= document.createElement("div");
    el.appendChild(who.cloneNode(false));
    txt= el.innerHTML;
    if(deep){
        ax= txt.indexOf('>')+1;
        txt= txt.substring(0, ax)+who.innerHTML+ txt.substring(ax);
    }
    el= null;
    return txt;
}

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

// Get chunk arrays within array with specified length
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

//  So if the string was '[[a],[b],[c]]' you could have [ [a], [a],[b], [a],[b],[c], [b], [b],[c],[c] ]
function getAllSubArrays(array) {
  var i, j, result = [];
  for (i = 0; i < array.length; i++) {
      for (j = i + 1; j < array.length + 1; j++) {
          result.push(array.slice(i, j));
      }
  }
  return result;
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

function arraysAreEqual(ary1,ary2){
  return (ary1.join('') == ary2.join(''));
}
