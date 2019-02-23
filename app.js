var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//Connecting to mongoose
mongoose.connect('mongodb://localhost/cs_trackulum_users');
var db = mongoose.connection;



//Routes
var routes = require('./routes/index');
var users = require('./routes/users');

//Init App
var app = express();

//Set static Path
app.use(express.static(path.join(__dirname,'public')));
app.use('/users', express.static('public'));



//View Engine
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname,'views'));

//Middleware
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

app.use('/',routes);
app.use('/users',users);





//Creating connection with SQL database
var connection = mysql.createConnection({
    host    : 'sql12.freesqldatabase.com',
    user    : 'sql12280273',
    password    : 'sSiHHrnh6D',
    database : 'sql12280273'
});


//Starting App
app.listen(3000,function(){
    console.log("Server started on port 3000");
    });
  
    
//Render homepage
/*app.get('/',function(req,res){
    res.render('homepage');
  });
*/

app.get('/authentication_page',function(req,res){
    res.render('authentication_page');

});


//Guest-Page
app.get('/guest_page',function(req,res){
    
    connection.query('SELECT * FROM Universities', function (err, result, fields) {
    if(err)
    throw err;
    else
   
    res.render('uni_list',{dropdownvals: result});
  });

});

//Render courses based on university id
app.get('/courses', function(req,res){
   
    var unicourseid = req.query.id;
    var uniname;
    connection.query('SELECT uname FROM Universities WHERE uid='+ unicourseid, function(err,result,fields){
        if(err)
        throw err;
        else
        uniname = result[0].uname;
        
    });
   
    connection.query('SELECT * FROM courses WHERE uni_course_id =' + unicourseid, function(err,result,fields){
        if(err)
        throw err;
        else
        
        res.render('courses',{courselist: result, uniname: uniname });
       
       
    });
    
});

//Handle Module requests
app.get('/modules',function(req,res){

    var courseid = req.query.id;
    console.log(courseid);
    var modulequery = "SELECT * FROM modules,courses_modules WHERE courses_modules.course_id =" + courseid + " AND courses_modules.module_id = modules.moduleid";
    connection.query(modulequery,function(err,result,fields){
        if(err)
        throw err
        else
        res.render('modules', {modulelist: result});


    });
});


//Handle Individual Module Information
app.get('/module_display',function(req,res){
    var module_code = req.query.code;
    connection.query('SELECT * FROM modules WHERE modulecode="' + module_code + '"' , function(err,result,fields){
        if(err)
        throw err
        else
        res.render('modules', {modulelist:result});
    });

});

//Handle academic user page
app.get('/academic_user_page',ensureAuthenticated,function(req,res){
    res.render('academic_user_page');
});


//SQL DB Handling
app.get('/sql_db',function(req,res){

    connection.query('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA="sql12280273" ', function(err,results,fields){
        if(err)
        {
            throw err;
        }

        else
        {
            res.render('sql_db', {table_names :results});
            
        }

    });
    
});

// Handling the request for SQL queries
app.get('/sql_db_dat',function(req,res){

     var sqlquery = req.query.queryname; 
     console.log("passed");
     console.log(sqlquery);
     connection.query(sqlquery,function(err,results,fields){
      if(err)
      {
         var status = {status: "failed"};
         data = {status,err};
         console.log("error sent");
         res.send(data);
      }

      else{
          console.log("sent");
          var status = {status : "passed"};
          data = {status,fields,results}
          res.send(data);
      }

      });
});

//Displaying welcome page for PopulateDB
app.get('/populatedb_welcome',function(req,res){
    res.render('populatedb_welcome');
});



function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
  

