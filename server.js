// Dependencies
// =============================================================
const express = require('express');
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


// Basic route that sends the user first to the AJAX Page

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', function(req,res) {
  let db = fs.readFileSync('./db/db.json');
  db = JSON.parse(db);
  res.json(db);
});
app.post('/api/notes', function(req, res){
  let db = fs.readFileSync('./db/db.json');
  db = JSON.parse(db);
  let data = req.body;
  data['id'] = uuidv4();
  db.push(data)
  // console.log(data)
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  res.json(data);

});
app.delete('/api/notes/:id', function (req,res){
  let db = fs.readFileSync('./db/db.json');
  db = JSON.parse(db);
  let id = req.params.id
  // console.log(db);
  let deleteElement = db.findIndex((element) => element.id === id);
  db.splice(deleteElement, 1);
  fs.writeFileSync('./db/db.json', JSON.stringify(db));
  res.send('Item Deleted');
})


app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});




app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
