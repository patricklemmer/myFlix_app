//Requires "express", "morgan", "uuid", "bodyParser", "mongoose" and Mongoose models
const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');
const res = require('express/lib/response');

//Assigns model names from model.js
const Movies = Models.Movie;
const Users = Models.User;

//Connects Mongoose to database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

//Arrays of objects for "movies" and "users"
// let movies = [
//   {
//     Title: 'Die Hard',
//     Description:
//       'An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
//     Genre: {
//       Name: 'Action',
//       Description:
//         'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
//     },
//     Director: {
//       Name: 'John McTiernan',
//       Bio: 'John McTiernan was born on January 8, 1951 in Albany, New York, USA. He is a director and producer, known for Die Hard (1988), Rollerball (2002) and Last Action Hero (1993). He has been married to Gail Sistrunk since 2012. He was previously married to Kate Harrington, Donna Dubrow and Carol Land.',
//       Birth: 1951 - 01 - 08,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/c/ca/Die_Hard_%281988_film%29_poster.jpg',
//     Featured: true,
//   },
//   {
//     Title: 'Into the Wild',
//     Description:
//       'After graduating from Emory University, top student and athlete Christopher McCandless abandons his possessions, gives his entire $24,000 saving account to charity and hitchikes to Alaska to live in the wilderness. Along the way, Christopher encounters a series of characters that shape his life.',
//     Genre: {
//       Name: 'Adventure',
//       Description:
//         'An adventure film is form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war.',
//     },
//     Director: {
//       Name: 'Sean Penn',
//       Bio: 'Sean Penn is a powerhouse film performer capable of intensely moving work, who has gone from strength to strength during a colourful film career, and who has drawn much media attention for his stormy private life and political viewpoints. Sean Justin Penn was born in Los Angeles, California, the second son of actress Eileen Ryan (née Annucci) and director, actor, and writer Leo Penn.',
//       Birth: 1960 - 08 - 17,
//     },
//     ImageURL:
//       'https://en.wikipedia.org/wiki/Into_the_Wild_(film)#/media/File:Into_the_Wild_(2007_film_poster).png',
//     Featured: false,
//   },
//   {
//     Title: 'Hotel Rwanda',
//     Description:
//       'Paul Rusesabagina, a hotel manager, houses over a thousand Tutsi refugees during their struggle against the Hutu militia in Rwanda, Africa.',
//     Genre: {
//       Name: 'Drama',
//       Description:
//         'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama.',
//     },
//     Director: {
//       Name: 'Terry George',
//       Bio: 'Terry George was born on December 20, 1952 in Belfast, Northern Ireland. He is a writer and producer, known for Hotel Rwanda (2004), In the Name of the Father (1993) and Some Mothers Son (1996). He has been married to Margaret Higgins since 1978. They have two children.',
//       Birth: 195 - 12 - 20,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/d/d5/Hotel_Rwanda_movie.jpg',
//     Featured: true,
//   },
//   {
//     Title: 'Forrest Gump',
//     Description:
//       'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
//     Genre: {
//       Name: 'Drama',
//       Description:
//         'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama.',
//     },
//     Director: {
//       Name: 'Robert Zemeckis',
//       Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making. Usually working with writing partner Bob Gale, Roberts earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985).',
//       Birth: 1952 - 05 - 14,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
//     Featured: false,
//   },
//   {
//     Title: 'The Lion King',
//     Description:
//       'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
//     Genre: {
//       Name: 'Animation',
//       Description:
//         'Animation is a method in which figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, most animations are made with computer-generated imagery (CGI).',
//     },
//     Director: {
//       Name: 'Roger Allers',
//       Bio: 'Roger Allers was born on June 29, 1949 in Rye, New York, USA. He is known for The Lion King (1994), Aladdin (1992) and Beauty and the Beast (1991). He has been married to Leslee Allers since 1965. They have two children.',
//       Birth: 1949 - 06 - 29,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg',
//     Featured: false,
//   },
//   {
//     Title: 'Jurassic Park',
//     Description:
//       'A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the parks cloned dinosaurs to run loose. Huge advancements in scientific technology have enabled a mogul to create an island full of living dinosaurs.',
//     Genre: {
//       Name: 'Action',
//       Description:
//         'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
//     },
//     Director: {
//       Name: 'Steven Spielberg',
//       Bio: 'Steven Allan Spielberg is an American film director, producer, and screenwriter. He began his career in the New Hollywood era and is currently the most commercially successful director of all time.',
//       Birth: 1946 - 12 - 18,
//     },
//     ImageURL: 'https://en.wikipedia.org/wiki/File:Jurassic_Park_poster.jpg',
//     Featured: false,
//   },
//   {
//     Title: 'The Terminal',
//     Description:
//       'The film is about an Eastern European man who is stuck in New Yorks John F. Kennedy Airport terminal when he is denied entry to the United States and at the same time is unable to return to his native country because of a military coup.',
//     Genre: {
//       Name: 'Comedy',
//       Description:
//         'A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement.',
//     },
//     Director: {
//       Name: 'Steven Spielberg',
//       Bio: 'Steven Allan Spielberg is an American film director, producer, and screenwriter. He began his career in the New Hollywood era and is currently the most commercially successful director of all time.',
//       Birth: 1946 - 12 - 18,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/8/86/Movie_poster_the_terminal.jpg',
//     Featured: false,
//   },
//   {
//     Title: 'Gladiator',
//     Description:
//       'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery. Maximus is a powerful Roman general, loved by the people and the aging Emperor, Marcus Aurelius.',
//     Genre: {
//       Name: 'Action',
//       Description:
//         'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
//     },
//     Director: {
//       Name: 'Ridley Scott',
//       Bio: 'Sir Ridley Scott is an English film director and producer. He has directed, among others, the science fiction films Alien, Blade Runner and The Martian, the road crime film Thelma & Louise, the historical drama film Gladiator, and the war film Black Hawk Down.',
//       Birth: 1937 - 11 - 30,
//     },
//     ImageURL:
//       'https://en.wikipedia.org/wiki/Gladiator_(2000_film)#/media/File:Gladiator_(2000_film_poster).png',
//     Featured: true,
//   },
//   {
//     Title: 'Black Hawk Down',
//     Description:
//       'Action/war drama based on the best-selling book detailing a near-disastrous mission in Somalia on October 3, 1993. On this date nearly 100 U.S. Army Rangers, commanded by Capt. Mike Steele, were dropped by helicopter deep into the capital city of Mogadishu to capture two top lieutenants of a Somali warlord.',
//     Genre: {
//       Name: 'Action',
//       Description:
//         'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
//     },
//     Director: {
//       Name: 'Ridley Scott',
//       Bio: 'Sir Ridley Scott is an English film director and producer. He has directed, among others, the science fiction films Alien, Blade Runner and The Martian, the road crime film Thelma & Louise, the historical drama film Gladiator, and the war film Black Hawk Down.',
//       Birth: 1937 - 11 - 30,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/0/0c/Black_hawk_down_ver1.jpg',
//     Featured: false,
//   },
//   {
//     Title: 'The Last Dance',
//     Description:
//       'The Last Dance is a 2020 American sports documentary miniseries co-produced by ESPN Films and Netflix. Directed by Jason Hehir, the series revolves around the career of Michael Jordan, with particular focus on his final season with the Chicago Bulls.',
//     Genre: {
//       Name: 'Documentary',
//       Description:
//         'A documentary film or documentary is a non-fictional motion-picture intended to "document reality, primarily for the purposes of instruction, education or maintaining a historical record".',
//     },
//     Director: {
//       Name: 'Jason Hehir',
//       Bio: 'Jason Hehir is a screenwriter, television producer and director. Hehir is recently known for directing the ESPN and Netflix production "The Last Dance," a 10-part documentary series that tells the story of Michael Jordans final Chicago Bulls season in 1997-98.',
//       Birth: 1976 - 09 - 29,
//     },
//     ImageURL:
//       'https://en.wikipedia.org/wiki/The_Last_Dance_(miniseries)#/media/File:The_Last_Dance_2020.jpg',
//     Featured: true,
//   },
//   {
//     Title: 'The Staircase',
//     Description:
//       'Originally released in 2004, “The Staircase” follows the indictment, trial, and conviction of crime author Michael Peterson for the death of his wife, Kathleen. In December 2001, she was found dead at the bottom of the staircase in their North Carolina home. Peterson was the only person in the house at the time.',
//     Genre: {
//       Name: 'Documentary',
//       Description:
//         'A documentary film or documentary is a non-fictional motion-picture intended to "document reality, primarily for the purposes of instruction, education or maintaining a historical record".',
//     },
//     Director: {
//       Name: 'Jean-Xavier de Lestrade',
//       Bio: 'Jason Hehir is a screenwriter, television producer and director. Hehir is recently known for directing the ESPN and Netflix production "The Last Dance," a 10-part documentary series that tells the story of Michael Jordans final Chicago Bulls season in 1997-98.',
//       Birth: 1963 - 07 - 01,
//     },
//     ImageURL:
//       'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Staircase.png',
//     Featured: false,
//   },
// ];

// let users = [
//   {
//     username: 'Homer Simpson',
//     Password: 'stupidflanders',
//     Email: 'homer@gmail.com',
//     Born: new Date('1956-05-12'),
//     // favouriteMovies: [
//     //   ObjectId('628664f3510b91c528a0c433'),
//     //   ObjectId('628664f3510b91c528a0c437'),
//     // ],
//   },
//   {
//     username: 'Marge Simpson',
//     Password: 'hrmmm',
//     Email: 'marge@gmail.com',
//     Born: new Date('1953-03-19'),
//     // favouriteMovies: [
//     //   ObjectId('628664f3510b91c528a0c435'),
//     //   ObjectId('628664f3510b91c528a0c438'),
//     //   ObjectId('628664f3510b91c528a0c431'),
//     // ],
//   },
//   {
//     username: 'Bart Simpson',
//     Password: 'eatmyshorts',
//     Email: 'bart@gmail.com',
//     Born: new Date('1978-04-01'),
//     // favouriteMovies: [
//     //   ObjectId('628664f3510b91c528a0c43a'),
//     //   ObjectId('628664f3510b91c528a0c432'),
//     //   ObjectId('628664f3510b91c528a0c436'),
//     //   ObjectId('628664f3510b91c528a0c438'),
//     // ],
//   },
//   {
//     username: 'Lisa Simpson',
//     Password: 'davidhasselhoff',
//     Email: 'lisa@gmail.com',
//     Born: new Date('1983-05-09'),
//     // favouriteMovies: [ObjectId('628664f3510b91c528a0c432')],
//   },
//   {
//     username: 'Maggie Simpson',
//     Password: 'silence',
//     Email: 'maggie@gmail.com',
//     Born: new Date('1989-01-12'),
//     // favouriteMovies: [
//     //   ObjectId('628664f3510b91c528a0c437'),
//     //   ObjectId('628664f3510b91c528a0c43b'),
//     // ],
//   },
//   {
//     username: 'Grampa Simpson',
//     Password: 'ahhh',
//     Email: 'grampa@gmail.com',
//     Born: new Date('1907-05-25'),
//     // favouriteMovies: [
//     //   ObjectId('628664f3510b91c528a0c433'),
//     //   ObjectId('628664f3510b91c528a0c438'),
//     //   ObjectId('628664f3510b91c528a0c432'),
//     // ],
//   },
// ];

//Endpoints and HTTP requests
//In order of CRUD

//CREATE

//Allow new users to register

// JSON format is epxpected
// {
//   ID: Integer,
//   Username: String,
//   Password: String,
//   Email: String,
//   Birthday: Date
//   }

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists.');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
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
});

//CREATE

//Allow users to add a movie to their list of favourites
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('User not found');
  }
});

//READ

//Return a list of ALL movies to the user

app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// app.get('/movies', (req, res) => {
//   res.status(200).json(movies);
// });

//READ

//Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('Movie not found.');
  }
});

//READ

//Return data about a a genre by name/title
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('Genre not found.');
  }
});

//READ

//Return data about a director by name
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('Director not found.');
  }
});

//UPDATE

//Allow users to update their user info
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('User not found');
  }
});

//DELETE

//Allow users to remove a movie from their list of favourites
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favouriteMovies = user.favouriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('User not found');
  }
});

//DELETE

//Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send('User not found');
  }
});

//Error handling Middleware (needs to be at the end of code, before PORT listener)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//Listens to server PORT and logs msg to console
app.listen(PORT, () => console.log('Server is running....'));
