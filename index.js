//Requires "express", "morgan", "uuid", "bodyParser", "mongoose" and Mongoose models
const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { check, validationResult } = require('express-validator');

//Assigns model names from model.js
const Movies = Models.Movie;
const Users = Models.User;

//Connects Mongoose to local database - code remains for testing purposes
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Connects Mongoose to remote database - active connection method
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Assigns express() to var "app"
const app = express();

//Invokes express.static to serve static files from folder "/public"
app.use(express.static(__dirname + '/public'));

//Invokes morgan to log URL requests to console
app.use(morgan('common'));

//Invokes body-parser Middleware
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

//Import of auth.js
let auth = require('./auth')(app);

//Requires Passport module and imports passport.js
const passport = require('passport');
require('./passport');

//Endpoints, CRUD and HTTP requests
//-----Please read!-----
//The CRUD functions below are sorted in the order of the acronym CRUD

//Index route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to myFlix');
});

//CREATE

//Allow new users to register

// JSON format is expected
// {
//   ID: Integer (set and added automatically),
//   Username: String,
//   Password: String,
//   Email: String,
//   Birthday: Date
//   }

app.post(
  '/users',
  //Validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    //Error check for validation object
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists.');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//CREATE

//Allow users to add a movie to their list of favourites

app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavouriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//READ

//Return a list of ALL movies to the user (temp deactivated to remove auth middleware from this endpoint)

// app.get(
//   '/movies',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     Movies.find()
//       .then((movies) => {
//         res.status(201).json(movies);
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//       });
//   }
// );

//Temp code (auth middleware removed for /movies)

app.get('/movies', function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//READ

//Return data about a single movie by title to the user

app.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((title) => {
        if (!title) {
          res.status(404).send('Movie not found.');
        } else {
          res.json(title);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//READ

//Return data about a genre by name

app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((genreName) => {
        if (!genreName) {
          res.status(404).send('Genre not found.');
        } else {
          res.json(genreName.Genre);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//READ

//Return data about a director by name

app.get(
  '/movies/directors/:directorName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((directorName) => {
        if (!directorName) {
          res.status(404).send('Director not found.');
        } else {
          res.json(directorName.Director);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//UPDATE

//Allow users to update their user info

// JSON format is epxpected
// {
//   Username: String,
//   (required)
//   Password: String,
//   (required)
//   Email: String,
//   (required)
//   Birthday: Date
// }

app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  //Validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    //Error check for validation object
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      //This line makes sure that the updated document is returned
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//DELETE

//Allow users to remove a movie from their list of favourites

app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavouriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//DELETE

//Allow existing users to deregister

app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Error handling Middleware (needs to be at the end of code, before PORT listener)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Assigns PORT to pre-configured port number in env var
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
