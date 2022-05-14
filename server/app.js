const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../client")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("index");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
