const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/public'));

let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks');
});

app.listen(PORT, () => console.log('Server is running....'));