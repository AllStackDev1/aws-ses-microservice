const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 1,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: '{value} is not a valid email'
      }
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    paid: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      city: String,
      country: String
    },
    dateOfBirth: Date,
    photoUrl: String,
    identification: {
      idType: String,
      idNumber: String
    },
    skypeId: String,
    isVerified: {
      email: { type: Boolean, default: false },
      premium: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
    isCatchment: Boolean,
    isSubscribe: Boolean,
    hasFarm: Boolean,
    role: { type: String, required: true },
    reference: String
  },
  { usePushEach: true }
); 

const User = mongoose.model('User', UserSchema);

module.exports = { User };
