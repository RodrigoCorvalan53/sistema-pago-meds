const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, "Public")));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "Views", "login.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "Views", "success.html"));
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log("🌐 Frontend PagoMeds corriendo en http://localhost:" + PORT);
});
