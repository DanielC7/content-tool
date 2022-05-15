let inDatabase = [];

const printSqlScript = (languageDropDown, sqlTextField, addedLanguages) => {
  if (languageDropDown.value !== "0") {
    const selectedLanguageRow = addedLanguages.find((lang) => {
      return lang[2] === languageDropDown.value;
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

  const updateScript =
    "UPDATE Translation_Location\n" +
    "SET Name = " +
    translatedData +
    "\nWHERE resourseId = " +
    resourseId;
  const insertScript =
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
    return updateScript;
  } else {
    inDatabase.push(resourseId);
    return insertScript;
  }
};

export { printSqlScript };
