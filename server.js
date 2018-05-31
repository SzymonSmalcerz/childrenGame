const express = require("express");
const path = require('path');


let app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
let PORT = process.env.PORT || 3000;

app.get("/game",(req,res) => {
  res.render("game/game");
});

app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
});
