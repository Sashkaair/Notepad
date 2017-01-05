// Start all requires
var express=require('express');
var path=require('path');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var exphbs=require('express-handlebars');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/notepad');// connect to DataBase
var db=mongoose.connection;

// Routes require
var routes=require('./routes/index')
var users=require('./routes/users')
// end of requires

// Init App
var app=express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');;

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname,'public')))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

// Express Session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}))


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
app.use(flash())

// Global vars
app.use(function(req,res,next){
    res.locals.succes_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})

// Routes
app.use('/', routes)
app.use('/users', users);

// Set Port
app.set('port',(process.env.PORT || 3000))
app.listen(app.get('port'),function(){
    console.log('Server start work on port: '+app.get('port'))
})