const express = require("express");
const router = express.Router();
const fs = require("fs");
const User = require("../models/students");
const multer = require("multer");



//router settings....
//get data from database....
router.get("/", (req, res) => {
    User.find().exec()
        .then(users => {
            res.render('home', {
                title: 'Home Page',
                users: users,
            });
        })
});


router.get("/add", (req, res) => {
    res.render('add_form', {
        title: 'Registration Form'
    })
})

//to uplaod image....
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
});
var upload = multer({
    storage: storage, 
}).single("image");

//add datas to database....
router.post("/add", upload, async (req, res) => {
    console.log(req.body);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        standard: req.body.standard,
        image: req.file.filename,
    });
    await user.save().then((result) => {
        console.log(result);
        res.redirect("/")
    });

});

//more page route.....
router.get("/more/:id", (req, res) => {
    let id = req.params.id
    User.findById(id).exec().
        then((user) => {
            res.render('more_form', {
                title: "Student Details",
                user,
            });
        });
});

//edit_form route.....
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then((user) => {
            if (user == null) {
                res.redirect("/");
            } else {
                res.render("edit_form", {
                    title: "Edit Student",
                    user: user,
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.redirect("/");
        });
});

//update routing.....
router.post("/edit/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        standard: req.body.standard,
        image: new_image,
      }).then(result => {
        res.redirect("/");
      }).catch(err => {
        console.log(err);
      });
      
});

//delete router.....
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id)
     .then((result) => {
        console.log(result);
        if (result && result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
    });
});













module.exports = router;