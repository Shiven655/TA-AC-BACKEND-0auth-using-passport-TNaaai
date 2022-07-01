var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var registerSchema = new Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    city: String,
  },
  { timestamps: true }
);

registerSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

registerSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result, this.firstName + ' ' + this.lastName);
  });
};

registerSchema.methods.fullName = function () {
  return cb(err, this.firstName + ' ' + this.lastName);
};

var Register = mongoose.model('Register', registerSchema);
module.exports = Register;
