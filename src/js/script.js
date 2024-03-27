var untranslateds = [];
var germanTranslations = [];
var currentSentenceIndex = 0;

// Function to display Dutch sentence
function displayuntranslated() {
  document.getElementById("untranslated").textContent = untranslateds[currentSentenceIndex];
}

// Function to check German translation
function checkTranslation() {
  var germanInput = document.getElementById("germanInput").value;
  var correctTranslation = germanTranslations[currentSentenceIndex];

  if (germanInput.trim().toLowerCase() === correctTranslation.trim().toLowerCase()) {
    document.getElementById("translationFeedback").textContent = "Correct!";
  } else {
    document.getElementById("translationFeedback").textContent = "Incorrect. The correct translation is: " + correctTranslation;
  }

  // Move to the next sentence
  currentSentenceIndex++;
  if (currentSentenceIndex < untranslateds.length) {
    displayuntranslated();
    document.getElementById("germanInput").value = "";
  } else {
    document.getElementById("germanInput").setAttribute("disabled", "disabled");
    document.getElementById("checkTranslation").setAttribute("disabled", "disabled");
    document.getElementById("translationFeedback").textContent = "You've completed all sentences!";
  }
}

// Load saved sentences on page load
document.addEventListener("DOMContentLoaded", function() {
  var untranslated = getCookie("untranslated");
  var translated = getCookie("translated");

  if (untranslated && translated) {
    untranslateds = untranslated.split("-");
    germanTranslations = translated.split("-");

    displayuntranslated();
  }
});

// Add event listener to the check translation button
document.getElementById("checkTranslation").addEventListener("click", function() {
  checkTranslation();
});

// Function to get cookie by name
function saveSentences() {
  // Get input values
  var untranslated = document.getElementById('untranslated').value;
  var translated = document.getElementById('translated').value;

  // Retrieve existing sentences from cookies
  var existinguntranslated = getCookie("untranslated");
  var existingtranslated = getCookie("translated");

  // Concatenate new sentences with existing ones
  if (existinguntranslated && existingtranslated) {
    untranslated = existinguntranslated + "-" + untranslated;
    translated = existingtranslated + "-" + translated;
  }

  // Save concatenated sentences in cookies
  document.cookie = "untranslated=" + encodeURIComponent(untranslated) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
  document.cookie = "translated=" + encodeURIComponent(translated) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";

  // Clear form fields
  document.getElementById('untranslated').value = "";
  document.getElementById('translated').value = "";
}

// Function to display saved sentences in modal
function displaySentences() {
  // Retrieve sentences from cookies
  var untranslated = getCookie("untranslated");
  var translated = getCookie("translated");

  // Display sentences in modal body
  var sentencesList = document.getElementById("sentencesList");
  sentencesList.innerHTML = ""; // Clear previous list content

  if (untranslated && translated) {
    var untranslateds = untranslated.split("-");
    var translateds = translated.split("-");

    // Find the minimum length of the two arrays
    var minLength = Math.min(untranslateds.length, translateds.length);

    // Display each pair of sentences
    for (var i = 0; i < minLength; i++) {
      var listItem = document.createElement("li");
      listItem.textContent = decodeURIComponent(untranslateds[i]) + " - " + decodeURIComponent(translateds[i]);
      sentencesList.appendChild(listItem);
    }
  }
}

// Function to get cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// Add event listener to the form for submission
document.getElementById("sentenceForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  saveSentences(); // Save sentences
  displaySentences(); // Display saved sentences
  $('#sentenceModal').modal('hide'); // Hide modal
});

// Load saved sentences on page load
document.addEventListener("DOMContentLoaded", function() {
  displaySentences();
});