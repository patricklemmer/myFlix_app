//Requires Mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

//Password hashing
//Hashes passwords
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
//Compares submitted passwords with stored passwords
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

//Creates models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//Exports models
module.exports.Movie = Movie;
module.exports.User = User;
