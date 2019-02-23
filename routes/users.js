var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Populatehistory = require('../models/populatehistory');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
require('dotenv').config();


//Creating connection with SQL database
var connection = mysql.createConnection({
    host    : 'sql12.freesqldatabase.com',
    user    : 'sql12280273',
    password    : 'sSiHHrnh6D',
    database : 'sql12280273'
});



router.get('/register' , function(req,res){
    res.render('register', {errors : ''});
});

router.get('/login' , function(req,res){
    res.render('login');
});


//Handling post of registration form
router.post('/register' , function(req,res){
    var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
    var password2 = req.body.password2;
    var universityname = req.body.universityname;
    var academicurl = req.body.academicurl;
    
    
   // Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid, should be of format XXXX@XXXX.ac.XXXX').matches(/[A-Z0-9a-z]+@[A-z.]+.ac.[A-Za-z]+/);
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('universityname', 'University Name is required').notEmpty();
    req.checkBody('academicurl', 'Academic URL is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    
    var errors = req.validationErrors();

    if(errors)
    {   console.log('no');
        res.render('register',{
            errors: errors
        });
    } 

    else{
        
        var newUser = new User({
            name : name,
            email: email,
            username: username,
            password: password,
            universityname: universityname,
            academicurl: academicurl

        });

        User.createUser(newUser,function(err,user){
            if(err)
            throw err
            else
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

//Passport Strategy
passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
    }));
    

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});    

//Handling post of login form
router.post('/login',
	passport.authenticate('local', { successRedirect: '/academic_user_page', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/academic_user_page');
	});

//Handling logout
router.get('/logout', function(req,res,next){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});

//Handling the request to add a university
router.get('/adduni',function(req,res){

    res.render('populatedb_adduni');
    
});

//Verifying the add university POST
router.post('/adduniverify',function(req,res){
    console.log("received");
    var uniname = req.body.uniname;
    var unideptname = req.body.unideptname;
    console.log(req.body.uniname);
    var data;
    if(req.user.universityname != uniname){ 
        data = {status: 'failed'};
        
        res.send(data);

    }

    else{
        data = {status: 'passed'};
        
        var queryname = 'INSERT INTO `Universities` (`uid`, `uname`, `departmentname`) VALUES (NULL,' + "'" +  uniname + "'" +  ',' + "'" + unideptname + "'" + ')'
        console.log(queryname);
        connection.query( queryname , function(err,results,fields){
            if(err)
            {
            res.send(err);}
            else
            {console.log(results);
             var d = (new Date()).toString();

            Populatehistory.create({username:req.user.username, 
                text: "added University:" + uniname,
                time: d
            },function(error,populatehistory){
                if(error)
                throw err
                else
                {
                    console.log("post created");
                }
            });   
            res.send(data);
        
            }
            
        });
        
    }

});


//Handling request to add course
router.get('/addcourse', function(req,res){
    connection.query('SELECT uname,uid FROM Universities',function(err,results,fields)
    { if(err){
            throw err;
        }

    else{
        res.render('populatedb_addcourse',{unidetails:results});}
    

    });

    });


//Verifying addcourse POST
router.post('/addcourseverify',function(req,res){
        var uname = req.body.uname;
        var uid = req.body.uid;
        var coursename = req.body.coursename;
        var coursetype = req.body.coursetype;
        var lecturehours = req.body.lecturehours;
        var labhours = req.body.labhours;
        var academicyear = req.body.academicyear;
        var d = (new Date()).toString();
        
        if(req.user.universityname != uname)
        {   
            console.log("unames donnt match");
            data = {status:"failed"};
            res.send(data);
        }

        else
        {
            data = {status:"passed"};
            var queryname = 'INSERT INTO `courses` (`courseid`, `course_name`, `course_type`, `lecture hours`, `lab hours`, `uni_course_id`,   `universityname`, `academic_year`) VALUES (NULL,"' + coursename + '","' + coursetype + '","' + lecturehours + '","' + labhours + '","' + uid + '","' + uname + '","'+ academicyear + '")';
            connection.query(queryname,function(err,results,fields){
                if(err)
                res.send(err);
                else
                {   
                    Populatehistory.create({username:req.user.username, 
                        text: "added Course:" + coursename,
                        time: d
                    },function(error,populatehistory){
                        if(error)
                        throw err
                        else
                        {
                            console.log("post created");
                        }
                    }); 

                    res.send(data);
                }
            }); 

        }

});


//Handling add module request
router.get('/addmodule', function(req,res){
    var unidetails; var coursedetails;
    connection.query('SELECT uname,uid FROM Universities',function(err,results1,fields)
    { if(err){
            throw err;
        }

    else{

        connection.query('SELECT * FROM courses',function(err,results,fields){
            if(err)
            throw err;
            else
            res.render('populatedb_addmodule',{unidetails:results1,coursedetails:results});
    
    
        });
       
        }

    });

   
    
    console.log(unidetails);

    



});

//Verifying addition of a module
router.post('/addmoduleverify',function(req,res){

        var uname = req.body.uname;
        var uid = req.body.uid;
        var coursename = req.body.coursename;
        var courseid = req.body.courseid;
        var modulecode = req.body.modulecode;
        var modulename = req.body.modulename;
        var moduleinfo = req.body.moduleinfo;
        var prerequisite = req.body.prerequisite;
        var corequisite = req.body.corequisite;
        var d = (new Date()).toString();
        if(req.user.universityname != uname)
        {
            data = {status:"failed"};
            res.send(data);
        }

        else
        {
            data = {status:"passed"};
            var queryname = 'INSERT INTO `modules` (`moduleid`, `modulecode`, `modulename`, `moduleinfo`, `prerequisite`, `corequisite`) VALUES (NULL,' + '"' + modulecode + '","' + modulename + '","' + moduleinfo + '","' + prerequisite + '","' + corequisite + '")';
            console.log(queryname);
            connection.query(queryname,function(err,results,fields){
                if(err)
                res.send(err);
                else
                {connection.query('SELECT moduleid FROM modules WHERE modulecode="'+modulecode+'"', function(err,results,fields){
                 if(err)
                 {res.send(err);}  
                 else
                 { 
                   
                   var moduleid = results[0].moduleid;
                   connection.query('INSERT INTO `courses_modules` (`course_id`,`module_id`) VALUES ("' + courseid + '",' + moduleid  + ')' , function(err,results,fields){

                    if(err)
                    res.send(err);
                    else
                    {   

                        Populatehistory.create({username:req.user.username, 
                            text: "added Module:" + modulename,
                            time: d
                        },function(error,populatehistory){
                            if(error)
                            throw err
                            else
                            {
                                console.log("post created");
                            }
                        }); 
                        res.send(data);
                    }

                   });

                
                    
                }     


                });
                
                }
                

            });
        }



});


//To show populate history
router.get('/populatehistory',function(req,res){
    Populatehistory.find(function(err,post){
        if(err)
        throw err;
        else
        {
            res.render('populatehistory', {posts:post});
        }
    })
   

});





module.exports = router;