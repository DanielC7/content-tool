import { flashMessage } from "./utils/flashMessage.js";
import { copyTextToClipboard } from "./utils/copyTextField.js";
import { printSqlScript } from "./sqlScriptController.js";

const languageForm = document.querySelector("#language-form");
const input = document.getElementById("input");
const copyBtn = document.getElementById("copy-btn");

const languageDropDown = document.querySelector("#language-dd");
const sqlTextField = document.querySelector("#sql-text");
const inputLabel = document.getElementById("input-label");
const defaultLang = document.createElement("option");
defaultLang.value = "0";
defaultLang.innerHTML = "Language";
let addedLanguages = [];

const getDataFromExcel = () => {
  sqlTextField.innerHTML = "";

  readXlsxFile(input.files[0]).then(function (rows) {
    if (!checkCorrectFormat(rows)) return;

    let relevantLangs = [];
    relevantLangs = rows.slice(1).filter((row) => {
      return row[1] !== null;
    });

    // Remove unrelevant languages(from previous file) from dropdown
    for (let addedLanguage of addedLanguages) {
      if (
        relevantLangs.find((lang) => {
          return lang[2] === addedLanguage[2];
        }) == undefined
      ) {
        let optionToDelete = document.getElementById(addedLanguage[2]);
        languageDropDown.removeChild(optionToDelete);
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
      languageDropDown.appendChild(newLang);
    }
    addedLanguages = relevantLangs;
  });

  flashMessage(inputLabel, "Successfuly uploaded file", "Green");
};

// Check if table skeleton(first row) is in correct format and then check the rest of the rows format
const checkCorrectFormat = (rows) => {
  let isCorrect = true;
  const patternRow = rows[0];

  if (
    patternRow[0] != "Id" ||
    patternRow[1] != "Translated" ||
    patternRow[2] != "Location Name"
  ) {
    isCorrect = false;
  }

  for (let i = 1; i < rows.length; i++) {
    if (typeof rows[i][0] !== "number" || typeof rows[i][2] !== "string") {
      isCorrect = false;
    }
  }

  if (!isCorrect) {
    languageDropDown.innerHTML = "";
    languageDropDown.appendChild(defaultLang);
    flashMessage(inputLabel, "Incorrect file format", "red");
    addedLanguages = [];
  }
  return isCorrect;
};

const showSQLScript = (e) => {
  e.preventDefault();
  printSqlScript(languageDropDown, sqlTextField, addedLanguages);
};

// This is a must, in order to re-upload a file with the same name (update)
const resetFileName = () => {
  input.value = "";
};

copyBtn.addEventListener("click", () => {
  copyTextToClipboard(sqlTextField);
});
input.addEventListener("click", resetFileName);
input.addEventListener("change", getDataFromExcel);
languageForm.addEventListener("submit", showSQLScript);
