const express = require('express');
const router = express.Router();
const { User } = require('../model/User')

const { auth } = require('../middleware/auth');

//=================================
//             User
//=================================

//TODO: Auth user 
router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history
  });
});



//TODO: User Register 
router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      user: user
    })
  })
})


//TODO: User login 
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) 
      return res.json({
        loginSuccess: false,
        message: "등록되지 않은 이메일입니다."
      });
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀립니다."})
      
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true, userId: user._id
            });
      });
    });
  });
});


//TODO: User logout 
router.get('/logout', (req, res) => {
  User.findByIdAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (res, doc) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    });
  });
});


//TODO: reset password 
router.post('/resetPassword', (req, res) => {

  if (req.body.password.length < 5) {
    return res.json({ success: false, message: "비밀번호의 최소길이는 5글자 이상입니다."})
  }

  User.resetPassword(req.body.email, req.body.password, (err, user) => {
    if(!user) return res.json({ success: false, message: "등록되지 않은 이메일입니다." })
    return res.status(200).json({
      success: true,
      message: "성공적으로 변경되었습니다."
    })
  })
})

module.exports = router;