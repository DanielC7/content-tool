const languageForm = document.querySelector("#language-form");
const languageDropDown = document.querySelector("#language-dd");
const sqlTextField = document.querySelector("#sql-text");
const input = document.getElementById("input");
const copyBtn = document.getElementById("copy-btn");
const inputLabel = document.getElementById("input-label");
let addedLanguages = [];
// let inDatabase = [];
const defaultLang = document.createElement("option");
defaultLang.value = "0";
defaultLang.innerHTML = "Language";
import { flashMessage } from "./utils/flashMessage.js";
import { copyTextToClipboard } from "./utils/copyTextField.js";
import { printSqlScript } from "./sqlScriptController.js";

const getDataFromExcel = () => {
  // Reset data on form/textfield
  sqlTextField.innerHTML = "";

  // Get data from excel file
  readXlsxFile(input.files[0]).then(function (rows) {
    if (!checkCorrectFormat(rows)) return;

    let relevantLangs = [];
    // Filter the languages with translation data - TODO WITH FILTER
    for (let i = 1; i < rows.length; i++) {
      // If there is translated data for the specific language
      if (rows[i][1] !== null) {
        relevantLangs.push(rows[i]);
      }
    }

    // Remove unrelevant old languages from dropdown
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

const checkCorrectFormat = (rows) => {
  let isCorrect = true;
  // First check if table skeleton(first row) is in correct format
  const patternRow = rows[0];
  if (
    patternRow[0] != "Id" ||
    patternRow[1] != "Translated" ||
    patternRow[2] != "Location Name"
  ) {
    isCorrect = false;
  }

  // Then check the rest of the table
  for (let i = 1; i < rows.length; i++) {
    // Check format is correct
    if (typeof rows[i][0] !== "number" || typeof rows[i][2] !== "string") {
      isCorrect = false;
    }
  }

  if (!isCorrect) {
    // Clear list
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
  //   if (languageDropDown.value !== "0") {
  //     //getSelectedLanguage
  //     const selectedLanguageRow = addedLanguages.find((lang) => {
  //       return lang[2] === languageDropDown.value;
  //     });

  //     sqlTextField.innerHTML = generateSqlScript(
  //       selectedLanguageRow,
  //       addedLanguages.indexOf(selectedLanguageRow)
  //     );
  //   } else {
  //     sqlTextField.innerHTML = "No language selected";
  //   }
};

// const generateSqlScript = (addedLanguage, languageId) => {
//   const resourseId = addedLanguage[0];
//   const translatedData = addedLanguage[1];
//   //   const languageName = addedLanguage[2];

//   const updateScript =
//     "UPDATE Translation_Location\n" +
//     "SET Name = " +
//     translatedData +
//     "\nWHERE resourseId = " +
//     resourseId;
//   const insertScript =
//     "INSERT INTO Translation_Location " +
//     "(LanguageId, " +
//     "ResourceId, " +
//     "Name)\n" +
//     "VALUES (" +
//     languageId +
//     ", " +
//     resourseId +
//     ", " +
//     translatedData +
//     ")";

//   if (inDatabase.includes(resourseId)) {
//     return updateScript;
//   } else {
//     inDatabase.push(resourseId);
//     return insertScript;
//   }
// };

// const copyTextToClipboard = (textField) => {
//   const copyLabel = document.getElementById("copy-label");
//   if (!textField.value.includes("Translation_Location")) {
//     flashMessage(copyLabel, "No SQL script to copy", "red");
//   } else {
//     navigator.clipboard.writeText(textField.value).then(
//       (success) => {
//         flashMessage(copyLabel, "Text copied!", "green");
//       },
//       (err) => {
//         flashMessage(copyLabel, "Error copying text", "red");
//       }
//     );
//   }
// };

// This is a must, in order to re-upload a file with the same name
const resetFileName = () => {
  input.value = "";
};

// TODO - move to utils file
// const flashMessage = (label, message, color) => {
//   label.innerHTML = message;
//   label.style.color = color;
//   setTimeout(function () {
//     label.innerHTML = "";
//   }, 3000);
// };

copyBtn.addEventListener("click", () => {
  copyTextToClipboard(sqlTextField);
});
input.addEventListener("click", resetFileName);
input.addEventListener("change", getDataFromExcel);
languageForm.addEventListener("submit", showSQLScript);
