document.getElementById('addCardBtn').addEventListener('click', function() {
    var untranslatedText = document.getElementById('untranslatedText').value;
    var translatedText = document.getElementById('translatedText').value;
    var untranslatedLanguage = document.getElementById('untranslatedLanguage').value;
    var translatedLanguage = document.getElementById('translatedLanguage').value;

    if (untranslatedText && translatedText) {
        var cardList = document.getElementById('cardList');

        var card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = untranslatedLanguage + " -> " + translatedLanguage;

        var cardDescription = document.createElement('p');
        cardDescription.classList.add('card-text');
        cardDescription.innerText = untranslatedText + '\n' + translatedText;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardDescription);

        card.appendChild(cardBody);

        cardList.appendChild(card);

        // Clear the input fields
        document.getElementById('untranslatedText').value = '';
        document.getElementById('translatedText').value = '';
    }
});