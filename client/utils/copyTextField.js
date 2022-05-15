import { flashMessage } from "./flashMessage.js";

const copyTextToClipboard = (textField) => {
  const copyLabel = document.getElementById("copy-label");
  if (!textField.value.includes("Translation_Location")) {
    flashMessage(copyLabel, "No SQL script to copy", "red");
  } else {
    navigator.clipboard.writeText(textField.value).then(
      (success) => {
        flashMessage(copyLabel, "Text copied!", "green");
      },
      (err) => {
        flashMessage(copyLabel, "Error copying text", "red");
      }
    );
  }
};

export { copyTextToClipboard };
