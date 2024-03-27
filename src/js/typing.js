document.addEventListener("DOMContentLoaded", function () {
  // Function to load data from cookies
  function loadFromCookie() {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split("=");
      if (cookie[0] === "sentences") {
        return JSON.parse(decodeURIComponent(cookie[1]));
      }
    }
    return null;
  }

  // Function to display the next sentence
  function displayNextSentence(sentences, currentIndex) {
    var untranslatedElement = document.getElementById("untranslated");
    var germanDisplay = document.getElementById("germanDisplay");
    var progressBar = document.getElementById("progressBar");
    if (sentences && currentIndex < sentences.length) {
      untranslatedElement.textContent = sentences[currentIndex].untranslated;
      var germanWords = sentences[currentIndex].translated.split(" ");
      var html = "";
      germanWords.forEach((word) => {
        html += "<span>";
        for (var i = 0; i < word.length; i++) {
          html += `<span class="letter">${word[i]}</span>`;
        }
        html += "</span> ";
      });
      germanDisplay.innerHTML = html;
    } else {
      untranslatedElement.textContent = "No more sentences available.";
      germanDisplay.innerHTML = "";
      progressBar.style.width = "100%";
    }
  }

  var sentences = loadFromCookie() || [];
  var currentIndex = 0;

  // Display initial sentence
  displayNextSentence(sentences, currentIndex);

  var isChecking = false; // Flag to indicate if typing is being checked
  var currentLetterIndex = 0; // Index of the current letter being checked
  function checkTyping(sentences, currentIndex, typedText) {
    var correctTranslation = sentences[currentIndex].translated;
    var typedWords = typedText.trim().split(" ");
    var correctWords = correctTranslation.trim().split(" ");
    if (typedWords.length === correctWords.length) {
      for (var i = 0; i < typedWords.length; i++) {
        if (typedWords[i] !== correctWords[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  // Function to update the progress bar
  function updateProgressBar(currentIndex, totalSentences) {
    var progressBar = document.getElementById("progressBar");
    var germanDisplay = document.getElementById("germanDisplay");
    var typedLetters = germanDisplay.querySelectorAll(".letter.typed");
    progressBar.style.width =
      (typedLetters.length / germanDisplay.textContent.length) * 130 + "%";
  }

  // Event listener for key press
  document.addEventListener("keydown", function (event) {
    if (!isChecking && event.key !== "Shift" && event.key !== "Alt") {
      isChecking = true; // Set flag to indicate that typing is being checked

      var germanDisplay = document.getElementById("germanDisplay");
      var typedLetter = event.key;
      var letterSpans = germanDisplay.querySelectorAll(".letter");
      console.log("unchecked: " + typedLetter); // Log the pressed key
      if (event.key === "Backspace") {
        event.preventDefault(); // Prevent the default behavior of the backspace key

        if (currentLetterIndex > 0) {
          currentLetterIndex--; // Go one letter back
          letterSpans[currentLetterIndex].classList.remove("typed", "wrong");
        }
      }
      // Check if the pressed key is a letter (excluding Shift)
      else if (/[a-zA-ZäÄ]/.test(typedLetter)) {
        updateProgressBar(currentIndex, sentences.length); // Update the progress bar
        if (currentLetterIndex < letterSpans.length) {
          if (letterSpans[currentLetterIndex].textContent === typedLetter) {
            letterSpans[currentLetterIndex].classList.add("typed");
            console.log("pressed: " + typedLetter); // Log the pressed key
            currentLetterIndex++;
          } else {
            letterSpans[currentLetterIndex].classList.add("wrong");
            currentLetterIndex++; // Go one letter further even if it's wrong
          }
        }

        if (currentLetterIndex === letterSpans.length) {
          if (checkTyping(sentences, currentIndex, germanDisplay.textContent)) {
            currentIndex++;
            currentLetterIndex = 0; // Reset the current letter index
            displayNextSentence(sentences, currentIndex);
            updateProgressBar(currentIndex, sentences.length); // Update the progress bar
          }
        }
      }

      setTimeout(function () {
        isChecking = false; // Reset flag to allow checking on next keydown event
      }, 10); // Wait for 1 second before allowing next check
    }
  });
});
