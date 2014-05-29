var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var TodoSchema = new Schema({
  title : String, 
  completed : Boolean,
  createdAt : Date,
  updatedAt : Date,
});


TodoSchema.pre( 'save', function(next, done) {
  if (this.isNew) {
    this.createdDate = Date.now();
  }
  this.updatedDate = Date.now();
  next();
});

mongoose.model( 'Todo', TodoSchema );
