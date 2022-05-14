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
    Title: 'Die Hard',
    Description:
      'An NYPD officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.',
    Genre: {
      Name: 'Action',
      Description:
        'Action film is a genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.',
    },
    Director: {
      Name: 'John McTiernan',
      Bio: 'John McTiernan was born on January 8, 1951 in Albany, New York, USA. He is a director and producer, known for Die Hard (1988), Rollerball (2002) and Last Action Hero (1993). He has been married to Gail Sistrunk since 2012. He was previously married to Kate Harrington, Donna Dubrow and Carol Land.',
      Birth: 1951,
    },
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/en/c/ca/Die_Hard_%281988_film%29_poster.jpg',
    Featured: true,
  },
  {
    Title: 'Into the Wild',
    Description:
      'After graduating from Emory University, top student and athlete Christopher McCandless abandons his possessions, gives his entire $24,000 saving account to charity and hitchikes to Alaska to live in the wilderness. Along the way, Christopher encounters a series of characters that shape his life.',
    Genre: {
      Name: 'Adventure',
      Description:
        'An adventure film is form of adventure fiction, and is a genre of film. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war.',
    },
    Director: {
      Name: 'Sean Penn',
      Bio: 'Sean Penn is a powerhouse film performer capable of intensely moving work, who has gone from strength to strength during a colourful film career, and who has drawn much media attention for his stormy private life and political viewpoints. Sean Justin Penn was born in Los Angeles, California, the second son of actress Eileen Ryan (née Annucci) and director, actor, and writer Leo Penn.',
      Birth: 1960,
    },
    ImageURL:
      'https://en.wikipedia.org/wiki/Into_the_Wild_(film)#/media/File:Into_the_Wild_(2007_film_poster).png',
    Featured: true,
  },
  {
    Title: 'Hotel Rwanda',
    Description:
      'Paul Rusesabagina, a hotel manager, houses over a thousand Tutsi refugees during their struggle against the Hutu militia in Rwanda, Africa.',
    Genre: {
      Name: 'Drama',
      Description:
        'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama.',
    },
    Director: {
      Name: 'Terry George',
      Bio: 'Terry George was born on December 20, 1952 in Belfast, Northern Ireland. He is a writer and producer, known for Hotel Rwanda (2004), In the Name of the Father (1993) and Some Mothers Son (1996). He has been married to Margaret Higgins since 1978. They have two children.',
      Birth: 1952,
    },
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/en/d/d5/Hotel_Rwanda_movie.jpg',
    Featured: false,
  },
  {
    Title: 'Forrest Gump',
    Description:
      'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
    Genre: {
      Name: 'Drama',
      Description:
        'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama.',
    },
    Director: {
      Name: 'Robert Zemeckis',
      Bio: 'A whiz-kid with special effects, Robert is from the Spielberg camp of film-making. Usually working with writing partner Bob Gale, Roberts earlier films show he has a talent for zany comedy (Romancing the Stone (1984), 1941 (1979)) and special effect vehicles (Who Framed Roger Rabbit (1988) and Back to the Future (1985).',
      Birth: 1951,
    },
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
    Featured: false,
  },
  {
    Title: 'The Lion King',
    Description:
      'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    Genre: {
      Name: 'Animation',
      Description:
        'Animation is a method in which figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, most animations are made with computer-generated imagery (CGI).',
    },
    Director: {
      Name: 'Roger Allers',
      Bio: 'Roger Allers was born on June 29, 1949 in Rye, New York, USA. He is known for The Lion King (1994), Aladdin (1992) and Beauty and the Beast (1991). He has been married to Leslee Allers since 1965. They have two children.',
      Birth: 1949,
    },
    ImageURL:
      'https://upload.wikimedia.org/wikipedia/en/3/3d/The_Lion_King_poster.jpg',
    Featured: false,
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
