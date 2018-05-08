const express = require('express');
const router = express.Router();
var path = require('path');

const Users = require('../model/usersModel')

var session = require('express-session');
var sess;


router.get('/register',(req,res,next) => {
    res.send('<h1> <center>Congratulations '+req.param('firstName')+'! You have successfully Registered! Team RATS are cooking something special for you! Stay Tuned!</center></h1><center><body><form method="get" action="/"><input type="submit" value="Go Back to Home Page"></form></body></center>');
});

router.get('/login',(req,res,next) => {
    res.send('<h1> <center>Congratulations '+req.param('firstName')+'! You have successfully Logged In! Team RATS are cooking something special for you! Stay Tuned!</center></h1><center><body><form method="get" action="/"><input type="submit" value="Go Back to Home Page"></form></body></center>');
});

router.get('/createUser', (req, res, next) => {
    console.log('Trying to register!');
    sess=req.session;

    console.log(req.query.Email);

    Users.findOne({ 'Email': req.query.Email }, function (err, user) {
        if (err) return handleError(err);
        if(user==null){

            const users = new Users({
                firstName: req.query.firstName,
                lastName: req.query.lastName,
                Email: req.query.Email,
                password: req.query.password,
                isAdmin: 'false'
            });

            users.save();
            req.session.username = req.query.Email;
            console.log(req.session.username);
            // req.session['username'] = req.param('username');
            res.sendFile(path.join(__dirname, '../', 'views', 'choosestream.html'));
            // res.sendFile(path.join(__dirname, '../', 'index.html'));
        }
        else {
            console.log("User is already registered!");
            res.sendFile(path.join(__dirname, '../', 'index.html'));
        }
    });


});

router.get('/choosestream', function (req, res, next) {
    sess = req.session;
    console.log(sess.username);
    Users.findOne({ 'Email': req.subcode }, function (err, user) {
        console.log(user.firstName);
        if(user!=null) {
            res.render('editProfile', {users: user});
        }
    });
})

router.get('/editProfile', (req, res, next) =>{
    sess = req.session;
    console.log(sess.username);
    Users.findOne({ 'Email': sess.username }, function (err, user) {
        console.log(user.firstName);
        if(user!=null) {
            res.render('editProfile', {users: user});
        }
    });

});

router.post('/update', (req, res, next) =>{
    sess = req.session;
    console.log(sess.username);
    console.log("Updating!")
    Users.findOneAndUpdate({ 'Email': sess.username },
        { $set: { firstName: req.param('firstname'),
                lastName: req.param('lastname'),
                Email: req.param('email')}},
        function (err, user) {
            if(err) console.log(user);
    });

    Users.findOne({ 'Email': sess.username }, function (err, user) {
        if(user!=null) {
            Users.findOne({ 'Email': sess.username }, function (err, user) {
                //console.log(user);
                if(user!=null) {
                    res.render('editProfile', {users: user});
                }
            });
        }
    });
});


router.get('/getAllUsers',(req,res,next) => {
    console.log("Admin wants to view users");
    Users.find({  }, {}, function (err, user) {
        console.log(user);
        res.render('admin_listusers', {users: user});
    });
});

router.get('/admin_listusers',(req,res,next) => {
    console.log("Admin clicked on view users");

    Users.find({  }, {}, function (err, user) {
        console.log(user);
        if(user!=null) {
            res.render('admin_listusers', {users: user});
        }
    });
});

router.get('/deleteProfile',(req,res,next) => {
    res.sendFile(path.join(__dirname, '../views/deleteProfile.html'));

});

router.get('/deleteUser',(req,res,next) => {
    // console.log("Admin clicked on view users");

    sess = req.session;
    console.log(sess.username);
    Users.deleteOne({Email: sess.username }, function (err, user) {
        res.sendFile(path.join(__dirname, '../', 'index.html'));
    });

    req.session.destroy(function(err) {
        // cannot access session here
    })
});

router.get('/loginpage', (req, res, next) =>{

    console.log("Rimpy");
    sess = req.session;
    console.log("Session")
    Users.findOne({ 'Email': req.param('username') }, function (err, user) {
        if (err) return handleError(err);
        if(user==null){
            res.sendFile(path.join(__dirname, '../', 'index.html'));
        }
        else {
            sess.username = user.Email;
            console.log(sess.username)
            // console.log(user.firstName);
            if(user.isAdmin=='true' || user.isAdmin==true){
                res.sendFile(path.join(__dirname, '../', 'views', 'admin.html'));
            }
            else {
                // res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
                res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html') );

            }
        }
    });

});

router.get('/Dashboard',(req,res,next) => {
    console.log("Dashboard");
    sess = req.session;
    console.log(sess.username);
    res.renderFile(path.join(__dirname, '../', 'views', 'article.html'));
    //res.sendFile(path.join(__dirname, '../', 'views', 'article.html'));

});

router.get('/recent',(req,res,next) => {
    console.log("recent");
    sess = req.session;
    console.log(sess.username);
    res.sendFile(path.join(__dirname, '../', 'views', 'recent.html'));

});

router.get('/rising',(req,res,next) => {
    console.log("rising");
    sess = req.session;
    console.log(sess.username);
    res.sendFile(path.join(__dirname, '../', 'views', 'rising.html'));

});

router.get('/courses',(req,res,next) => {
    console.log("courses");
    sess = req.session;
    console.log(sess.username);
    res.sendFile(path.join(__dirname, '../', 'views', 'courses.html'));

});

router.get('/registerpage',(req,res,next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'CreateProfile.html'));
});

module.exports = router;