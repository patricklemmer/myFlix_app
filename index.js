//Requires "express" and "morgan"
const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  bodyParser = require('body-parser');

//Assigns express() to var "app"
const app = express();

//Assigns PORT # to var "PORT"
const PORT = 8080;

//Invokes express.static to serve static files from folder "/public"
app.use(express.static(__dirname + '/public'));
//Invokes morgan to log URL requests to console
app.use(morgan('common'));
//Invokes body-parser Middleware
app.use(bodyParser.json());

//Creates JSON object for endpoint "/movies"
let movies = [
  {
    Title: 'Narcos',
    Description: 'Text',
    Genre: { Name: 'Text', Description: 'Text' },
    Director: { Name: 'Text', Bio: 'Text', Birthdate: 2000 },
    ImageURL: 'Link',
    Featured: true,
  },
  {
    Title: 'Narcos',
    Description: 'Text',
    Genre: { Name: 'Text', Description: 'Text' },
    Director: { Name: 'Text', Bio: 'Text', Birthdate: 2000 },
    ImageURL: 'Link',
    Featured: true,
  },
  {
    Title: 'Narcos',
    Description: 'Text',
    Genre: { Name: 'Text', Description: 'Text' },
    Director: { Name: 'Text', Bio: 'Text', Birthdate: 2000 },
    ImageURL: 'Link',
    Featured: true,
  },
  {
    Title: 'Narcos',
    Description: 'Text',
    Genre: { Name: 'Text', Description: 'Text' },
    Director: { Name: 'Text', Bio: 'Text', Birthdate: 2000 },
    ImageURL: 'Link',
    Featured: true,
  },
  {
    Title: 'Narcos',
    Description: 'Text',
    Genre: { Name: 'Text', Description: 'Text' },
    Director: { Name: 'Text', Bio: 'Text', Birthdate: 2000 },
    ImageURL: 'Link',
    Featured: true,
  },
];

let users = [
  { id: 1, name: 'Joe', favouriteMovies: [] },
  { id: 2, name: 'Sophie', favouriteMovies: [] },
];

//Get functions
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks');
});

//Error handling Middleware (needs to be at the end of code, before PORT listener)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Listens to server PORT and logs msg to console
app.listen(PORT, () => console.log('Server is running....'));
