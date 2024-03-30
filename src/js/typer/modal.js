document.addEventListener("DOMContentLoaded", function() {
    // Function to serialize form data
    function serializeForm(form) {
        var obj = {
            untranslated: form.querySelector('#untranslated').value,
            translated: form.querySelector('#translated').value
        };
        return obj;
    }

    // Function to save data to cookies
    function saveToCookie(data) {
        document.cookie = "sentences=" + JSON.stringify(data);
    }

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

    // Function to display sentences in the list
    function displaySentences(sentences) {
        var sentencesList = document.getElementById("sentencesList");
        sentencesList.innerHTML = "";
        if (sentences) {
            sentences.forEach(function(sentence, index) {
                var listItem = document.createElement("li");
                listItem.textContent = sentence.untranslated + " - " + sentence.translated;
                var removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.addEventListener("click", function() {
                    sentences.splice(index, 1);
                    saveToCookie(sentences);
                    displaySentences(sentences);
                });
                listItem.appendChild(removeButton);
                sentencesList.appendChild(listItem);
            });
        }
    }

    // Event listener for form submission
    document.getElementById("sentenceForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var form = event.target;
        var data = serializeForm(form);
        var savedData = loadFromCookie() || [];
        savedData.push(data);
        saveToCookie(savedData);
        displaySentences(savedData);
        form.reset();
    });

    // Event listener for modal show event
    $('#sentenceModal').on('show.bs.modal', function() {
        var savedData = loadFromCookie();
        if (savedData) {
            displaySentences(savedData);
        }
    });
});