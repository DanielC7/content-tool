const languageForm = document.querySelector("#language-form");
const selectedLanguage = document.querySelector("#language-dd");
const sqlTextField = document.querySelector("#sql-text");
const input = document.getElementById("input");
const copyBtn = document.getElementById("copy-btn");
let addedLanguages = [];
let inDatabase = [];
const defaultLang = document.createElement("option");
defaultLang.value = "0";
defaultLang.innerHTML = "Language";

const getDataFromExcel = () => {
  const inputLabel = document.getElementById("input-label");
  // Reset data on form/textfield
  sqlTextField.innerHTML = "";

  // Get data from excel file
  readXlsxFile(input.files[0]).then(function (rows) {
    // TODO - move format checking to a different function
    // Check if file is in correct format
    const patternRow = rows[0];
    if (
      patternRow[0] != "Id" ||
      patternRow[1] != "Translated" ||
      patternRow[2] != "Location Name"
    ) {
      // TODO - show message to user
      selectedLanguage.innerHTML = "";
      selectedLanguage.appendChild(defaultLang);
      flashMessage(inputLabel, "Incorrect file format", "red");
      addedLanguages = [];
      return;
    }

    let relevantLangs = [];
    // Filter the languages with translation data - TODO WITH FILTER
    for (let i = 1; i < rows.length; i++) {
      // Check format is correct
      if (typeof rows[i][0] !== "number" || typeof rows[i][2] !== "string") {
        // Clear list
        selectedLanguage.innerHTML = "";
        selectedLanguage.appendChild(defaultLang);
        flashMessage(inputLabel, "Incorrect file format", "red");
        addedLanguages = [];
        return;
      }
      // If there is translated data for the specific language
      if (rows[i][1] !== null) {
        relevantLangs.push(rows[i]);
      }
    }

    // If there is no change, don't change
    // if (relevantLangs === addedLanguages) return;
    // Remove unrelevant old languages from dropdown
    for (let addedLanguage of addedLanguages) {
      if (
        relevantLangs.find((lang) => {
          return lang[2] === addedLanguage[2];
        }) == undefined
      ) {
        console.log(addedLanguage[2]);
        let optionToDelete = document.getElementById(addedLanguage[2]);
        selectedLanguage.removeChild(optionToDelete);
      }
    }

    // Add relevant languages to dropdown (no duplicates from older uploads)
    for (let releventLang of relevantLangs) {
      if (
        addedLanguages.find((lang) => {
          return lang[2] === releventLang[2];
        }) != undefined
      )
        continue;

      const newLang = document.createElement("option");
      newLang.value = releventLang[2];
      newLang.setAttribute("id", releventLang[2]);
      newLang.innerHTML = releventLang[2];
      selectedLanguage.appendChild(newLang);
    }
    addedLanguages = relevantLangs;
  });
};

const showSQLScript = (e) => {
  e.preventDefault();
  if (selectedLanguage.value !== "0") {
    //getSelectedLanguage
    const selectedLanguageRow = addedLanguages.find((lang) => {
      return lang[2] === selectedLanguage.value;
    });

    sqlTextField.innerHTML = generateSqlScript(
      selectedLanguageRow,
      addedLanguages.indexOf(selectedLanguageRow)
    );
  } else {
    sqlTextField.innerHTML = "No language selected";
  }
};

const generateSqlScript = (addedLanguage, languageId) => {
  const resourseId = addedLanguage[0];
  const translatedData = addedLanguage[1];
  //   const languageName = addedLanguage[2];

  const updateStr =
    "UPDATE Translation_Location\n" +
    "SET Name = " +
    translatedData +
    "\nWHERE resourseId = " +
    resourseId;
  const insertStr =
    "INSERT INTO Translation_Location " +
    "(LanguageId, " +
    "ResourceId, " +
    "Name)\n" +
    "VALUES (" +
    languageId +
    ", " +
    resourseId +
    ", " +
    translatedData +
    ")";

  if (inDatabase.includes(resourseId)) {
    return updateStr;
  } else {
    inDatabase.push(resourseId);
    return insertStr;
  }
};

// const copyTextToClipboard = () => {
//   const copyLabel = document.getElementById("copy-label");
//   navigator.clipboard.writeText(sqlTextField.value).then(
//     (success) => {
//       copyLabel.innerHTML = "text copied";
//       copyLabel.style.color = "green";
//     },
//     (err) => {
//       copyLabel.innerHTML = "error copying text";
//       copyLabel.style.color = "red";
//     }
//   );
//   setTimeout(function () {
//     copyLabel.innerHTML = "";
//   }, 5000);
// };

const copyTextToClipboard = () => {
  const copyLabel = document.getElementById("copy-label");
  if (!sqlTextField.value.includes("Translation_Location")) {
    flashMessage(copyLabel, "There's nothing important to copy", "red");
  } else {
    navigator.clipboard.writeText(sqlTextField.value).then(
      (success) => {
        flashMessage(copyLabel, "Text copied!", "green");
      },
      (err) => {
        flashMessage(copyLabel, "Error copying text", "red");
      }
    );
  }
};

const flashMessage = (label, message, color) => {
  label.innerHTML = message;
  label.style.color = color;
  setTimeout(function () {
    label.innerHTML = "";
  }, 3000);
};

copyBtn.addEventListener("click", copyTextToClipboard);
input.addEventListener("change", getDataFromExcel);
languageForm.addEventListener("submit", showSQLScript);
