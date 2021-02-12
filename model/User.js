const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment');

const userSchema = mongoose.Schema({
  name: {
    type:String,
    maxlength:50
  },
  email: {
    type:String,
    trim:true,
    unique: 1
  },
  password: {
    type:String,
    minlength:5
  },
  lastname: {
    type:String,
    maxlength: 50
  },
  role: {
    type:Number,
    default: 0
  },
  cart: {
    type:Array,
    default: []
  },
  history: {
    type:Array,
    default: []
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
},{timestamps: true})


// mongoose middleware 중 pre hook : save 하기 전 실행하는 middleware : 비밀번호 암호화 
userSchema.pre('save', function( next ) {
  var user = this;

  if(user.isModified('password')) {
    // console.log('password changed');

    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})

// 비밀번호 비교 처리 (암호화 vs Plain)
userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  })
}

// 비밀번호 변경값
userSchema.statics.resetPassword = function(email, plainPassword, cb) {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(plainPassword, salt, function(err, hash) {
      if(err) return next(err);
      
      User.findOneAndUpdate({ email: email }, {password: hash}, (err, user) => {
        if(!user) return cb(err);
        return cb(null, user);
      })
    })
  })
};


// 토큰 생성 
userSchema.methods.generateToken = function(cb) {
  var user = this;

  var token = jwt.sign(user._id.toHexString(), 'secret');
  var onHour = moment().add(1, 'hour').valueOf();

  user.tokenExp = onHour;
  user.token = token;
  user.save(function (err, user) {
    if(err) return cb(err);
    cb(null, user);
  })
}

// Find Token 
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  
  jwt.verify(token, 'secret', function(err, decode) {
    user.findOne({ "_id":decode, "token":token }, function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }