const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.redirect('/videos')
})
app.get("/videos", (req, res) => {
  res.sendFile('/app/public/upload.html')
});

app.listen(3500, () => {
  console.log("Upload service listening on port 3500");
});