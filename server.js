var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.Promise = require('q').Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());


mongoose.connect('mongodb://localhost:27017/userManagementSystem', function (err, client) {
    if (err) {
        console.log("Not connected to db" + err);
    }
    else {
        console.log("Successfully connected");
        app.listen(port, function () {
            console.log("Running on port" + port);
        });
    }
});

var userSchema = new Schema({
    email: String,
    location: String,
    password: String,
    phone: Number,
    username: String
})

var msgSchema = new Schema({
    recipient: String,
    sender: String,
    title: String,
    description: String
})

var replySchema = new Schema({
    username : String,
    replyFor: String,
    replyMsg: String
})

var impMsgSchema = new Schema({
    username: String,
    recipient: String,
    sender: String,
    title: String,
    description: String
})

var user = mongoose.model("user", userSchema);
var msg = mongoose.model("msg", msgSchema);
var impMsg = mongoose.model("impMsg", impMsgSchema);
var reply = mongoose.model('reply', replySchema);

app.post('/register', function (req, res) {
    var user1 = new user({
        email: req.body.email,
        location: req.body.location,
        password: req.body.password,
        phone: req.body.phone,
        username: req.body.username
    })

    user1.save(function (err, resp) {
        if (err) {
            res.send({
                isRegister: false,
                msg: "Registeration failed"
            });
        }
        else {
            res.send({
                isRegister: true,
                msg: "Registeration successfully done"
            });
        }
    })
});


app.post('/login', function (req, res) {

    var query = user.findOne({
        "username": req.body.username,
        "password": req.body.password
    })

    query.exec((err, result) => {
        if (result != null) {
            res.send({
                isLoggedIn: true,
                msg: "Logged in successfully",
                loginInfo: result
            });
        }
        else {
            res.send({
                isLoggedIn: false,
                msg: "Could not find details"
            });
        }
    });
});

app.post('/editProfile', function (req, res) {

    var query = user.update({
        "username": req.body.username
    })
    query.exec((err, result) => {
        console.log(result);


    })
});

app.post('/messages', function (req, res) {

    var query = msg.find({
        "recipient": req.body.username
    })
    query.exec(function (err, result) {
        res.send({
            msg: "msg found",
            msgInfo: result
        });

    })

});

app.post('/important', function (req, res) {

    var imp1 = new impMsg({
        username: req.body.username,
        recipient: req.body.recipient,
        sender: req.body.sender,
        title: req.body.title,
        description: req.body.description
    })

    imp1.save((err, result) => {
        res.send({
            msg: "important msgs saved",
            impmsgInfo: result
        })
    })
})

app.post('/importantMsgList', function (req, res) {

    var query = impMsg.find({
        "username": req.body.username
    })

    query.exec((err, result) => {
        res.send({
            msg: "sending imp mgs",
            data: result
        })
    })
})

app.post('/replylist' , function(req,res){

    var query = reply.find({"username" : req.body.username});

    query.exec((err,result)=>{
        console.log("result from db" , result);
        res.send(result);
    })
})

app.post('/delete', function (req, res) {
    var query = msg.remove({
        "title": req.body.title
    })
    query.exec(function (err, result) {
         console.log("deleted result", result)
         res.send(result);
    })
})

app.post('/reply' , (req,resp)=>{
    console.log(req.body);

    var reply1 = new reply({
        username: req.body.username,
        replyFor : req.body.replyto,
        replyMsg : req.body.msg
    })

    reply1.save(function(err,result){
        console.log("result saved in db" , result)
        resp.send(result);
    })
})


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/app.html');
});
