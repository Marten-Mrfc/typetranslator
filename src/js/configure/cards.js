const key = "your-encryption-key";

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

function decryptData(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Failed to decrypt data:", error);
    return null;
  }
}

function reloadCards() {
  const cardList = document.querySelector("#cardList");
  cardList.innerHTML = "";

  const cookies = document.cookie.split(";");
  const cookieMap = new Map();

  cookies.forEach((cookie) => {
    const [cookieName, encryptedCookieValue] = cookie.trim().split("=");
    const decryptedValue = decryptData(encryptedCookieValue);

    if (!encryptedCookieValue) {
      console.warn(`No value for cookie: ${cookieName}`);
      return;
    }

    if (decryptedValue === null) {
      console.warn(`Failed to decrypt cookie: ${cookieName}`);
      return;
    }

    const parsedValue = JSON.parse(decryptedValue);

    if (cookieMap.has(cookieName)) {
      cookieMap.get(cookieName).push(...parsedValue);
    } else {
      cookieMap.set(cookieName, parsedValue);
    }
  });

  const fragment = document.createDocumentFragment();

  cookieMap.forEach((cookieValues, cookieName) => {
    cookieValues.forEach((cookieValue) => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");
      card.setAttribute("data-aos", "zoom-in");
      card.setAttribute("data-aos-delay", "40");
      card.setAttribute("data-aos-offset", "-2");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.innerText = cookieName;

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerText = `${cookieValue.untranslatedtext} - ${cookieValue.translatedtext}`;

      const removeButton = document.createElement("button");
      removeButton.classList.add("btn", "btn-danger");
      removeButton.innerText = "Remove";
      removeButton.addEventListener("click", () => {
        removeCard(cookieName, cookieValue);
      });

      cardBody.append(cardTitle, cardText, removeButton);
      card.appendChild(cardBody);
      fragment.appendChild(card);
    });
  });

  cardList.appendChild(fragment);
}

function removeCard(cookieName, cookieValue) {
  const existingCookieValue = getCookie(cookieName);
  const cookieValues = existingCookieValue
    ? JSON.parse(existingCookieValue)
    : [];
  const updatedCookieValues = cookieValues.filter(
    (value) =>
      value.untranslatedtext !== cookieValue.untranslatedtext ||
      value.translatedtext !== cookieValue.translatedtext
  );
  const cookieValueString = JSON.stringify(updatedCookieValues);
  const encryptedCookieValue = encryptData(cookieValueString);
  document.cookie = `${cookieName}=${encryptedCookieValue};`;
  reloadCards();
}

document.addEventListener("DOMContentLoaded", () => {
  reloadCards();
});

document.querySelector("#addCardBtn").addEventListener("click", () => {
  const untranslatedText = document.querySelector("#untranslatedText").value;
  const translatedText = document.querySelector("#translatedText").value;
  const untranslatedLanguage = document.querySelector(
    "#untranslatedLanguage"
  ).value;
  const translatedLanguage = document.querySelector(
    "#translatedLanguage"
  ).value;

  if (untranslatedText && translatedText) {
    const cookieName = `${untranslatedLanguage}-${translatedLanguage}`;
    const existingCookieValue = getCookie(cookieName);
    const cookieValues = existingCookieValue
      ? JSON.parse(existingCookieValue)
      : [];
    cookieValues.push({
      untranslatedtext: untranslatedText,
      translatedtext: translatedText,
    });
    const cookieValue = JSON.stringify(cookieValues);
    const encryptedCookieValue = encryptData(cookieValue);
    document.cookie = `${cookieName}=${encryptedCookieValue};`;
    document.querySelector("#untranslatedText").value = "";
    document.querySelector("#translatedText").value = "";
  }
  reloadCards();
});

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, encryptedCookieValue] = cookies[i].trim().split("=");

    if (cookieName === name) {
      const decryptedValue = decryptData(encryptedCookieValue);
      return decryptedValue;
    }
  }

  return "";
}
document.getElementById("arrowIcon").addEventListener("click", function () {
    // Toggle the visibility of the configuration
    var configurer = document.querySelector(".configurer");
    var cardList = document.querySelector("#cardList");
    
    if (configurer.style.display !== "block" && configurer.style.display !== "") {
        configurer.style.display = "block";
        cardList.style.paddingTop = "";
        document.getElementById("arrowIcon").innerHTML =
            '<i class="bi bi-file-earmark-arrow-up"></i>Hide';
    } else {
        configurer.style.display = "none";
        cardList.style.paddingTop = "10vh";
        document.getElementById("arrowIcon").innerHTML =
            '<i class="bi bi-file-earmark-arrow-down"></i>Show';
    }
});
