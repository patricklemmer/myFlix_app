//Requiring Express
const express = require('express');
//Setting Express to var "app"
const app = express();

let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

//GET requests
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks')
});

//Serving static files using express "static" function
app.use('/documentation', express.static('public'));

//Server PORT
app.listen(8080, () => {
  console.log('Server running...');
});