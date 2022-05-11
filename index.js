//Requires "express" and "morgan"
const express = require('express');

//Assigns express() to var "app"
const app = express();

//Assigns PORT # to var "PORT"
const PORT = 8080;

//"app.use" invokes Middleware functions
app.use(express.static(__dirname + '/public'));

//Creates JSON object for endpoint "/movies"
let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

//Get functions
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks');
});

//Listens to server PORT and logs msg to console
app.listen(PORT, () => console.log('Server is running....'));