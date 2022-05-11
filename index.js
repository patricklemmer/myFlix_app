//Requires "express" and "morgan"
const express = require('express'),
  morgan = require('morgan');

//Assigns express() to var "app"
const app = express();

//Assigns PORT # to var "PORT"
const PORT = 8080;

//Invokes express.static to serve static files from folder "/public"
app.use(express.static(__dirname + '/public'));
//Invokes morgan to log URL requests to console
app.use(morgan('common'));

//Creates JSON object for endpoint "/movies"
let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

//Get functions
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks');
});

//Error handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Listens to server PORT and logs msg to console
app.listen(PORT, () => console.log('Server is running....'));