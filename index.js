// //Requiring Express
// const express = require('express');

// //Setting Express to var "app"
// const app = express();

// let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

// //Serving static files from "public" folder using express "static" function
// app.use(express.static('public'));

// //GET requests
// app.get('/movies', (req, res) => {
//   res.json(topMovies);
// });

// app.get('/', (req, res) => {
//   res.send('Netflix sucks')
// });

// //Server PORT
// app.listen(8080, () => {
//   console.log('Server running...');
// });

const express = require('express');
const app = express();
const PORT = 8080;

app.use('/documentation', express.static(__dirname + '/public'));

let topMovies = [{ title: 'Narcos', director: '' }, { title: 'Narcos Mexico', director: '' }, { title: 'Breaking Bad', director: '' }, { title: 'Die Hard', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }, { title: '', director: '' }];

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Netflix sucks');
});

app.listen(PORT, () => console.log('Server is running....'));