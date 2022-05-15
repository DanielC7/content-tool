const flashMessage = (label, message, color) => {
  label.innerHTML = message;
  label.style.color = color;
  setTimeout(function () {
    label.innerHTML = "";
  }, 3000);
};
export { flashMessage };
