//Requires Mongoose
const mongoose = require('mongoose');

//Defines schemas
//Movie schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Born: Date,
    Died: Date,
  },
  ImagePath: String,
  Featured: Boolean,
});

//User schema
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

//Creates models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//Exports models
module.exports.Movie = Movie;
module.exports.User = User;
