//Requires "express", "morgan", "uuid", "bodyParser", "mongoose" and models
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

/**
 * Databse connection; INACTIVE - can be activated for development
 */
//Connects Mongoose to local database - code remains for testing purposes
// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

/**
 * Databse connection; ACTIVE - can be deactivated for development
 */
// Connects Mongoose to remote database - active connection method
mongoose.connect(
  process.env.CONNECTION_URI ||
    'mongodb+srv://patricklemmer:vBv3hbfob1zZ2WDn@meerkatstudio.eodnd.mongodb.net/myFlixDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//Assigns express() to var "app"
const app = express();

/**
 * Serves sstatic content for the app from the 'public' directory
 */
app.use(express.static(__dirname + '/public'));

//Invokes morgan to log URL requests to console
app.use(morgan('common'));

//Invokes body-parser Middleware
app.use(bodyParser.json());

// Setting CORS policy for all origins
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

/**
 * GET: Index route
 * @returns Welcome message
 */
//Index route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to myFlix');
});

/**
 * POST: Allows new users to register; Username, Password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
 */
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

    // Creates hashed password from given password
    let hashedPassword = Users.hashPassword(req.body.Password);

    // Creates new user
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        // Throws error if username already exists
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists.');
          // If username doesn't exist, create new user with params from req body
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

/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns updated user object
 * @requires passport
 */
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Finds user by username
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavouriteMovies: req.params.MovieID }, // Adds movie to the list
      },
      { new: true }, // Returns updated document
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser); // Returns JSON object of updatedUser
        }
      }
    );
  }
);

//READ

//Return a list of ALL movies to the user

app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * GET: Returns data (description, genre, director, imageURL, whether it’s featured or not) about a single movie by title to the user
 * Request body: Bearer token
 * @param title
 * @returns movie object
 * @requires passport
 */
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

/**
 * GET: Returns data about a genre (description) by name/title (e.g., Action)
 * Request body: Bearer token
 * @param Name (Genre)
 * @returns genre object
 * @requires passport
 */
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

/**
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param Name (Director)
 * @returns director object
 * @requires passport
 */
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

/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (user) {
          // If a user with the corresponding username was found, return user info
          res.status(200).json(user);
        } else {
          res
            .status(400)
            .send(
              'User with the username ' + req.params.Username + ' was not found'
            );
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
 */
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

    // Finds user by username
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
          res.json(updatedUser); // Returns JSON object of updatedUser
        }
      }
    );
  }
);

/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
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

/**
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Finds user by username
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        // If user is found return success message, if not return error
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

/**
 * Error handling; specifically at end of code BEFORE PORT definition
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! ' + err.stack);
});

/**
 * PORT definition, assigns PORT to pre-configured number in env var
 */
const port = process.env.PORT || 8090;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
