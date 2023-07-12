const bcrypt = require("bcryptjs");
const Question = require("../models/Question");
const Passed = require('../models/Passed')
const Review = require('../models/Review')
const Comment = require('../models/Comment')

// const Role = require("../models/Role");
const User = require("../models/User");

// const {check} = require("express-validator")

// const {validationResult} = require('express-validator')

exports.landing_page = (req, res) => {
    res.render("landing");
};

exports.login_get = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render("login", {err: error, data: req.body});

};

exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        req.session.error = "Invalid Credentials";
        return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        req.session.error = "Invalid Credentials";
        return res.redirect("/login");
    }

    req.session.isAuth = true;
    console.log(req.body);
    req.session.user = user
    res.redirect("user-profile");
};

exports.register_get = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render("register", {err: error});
};

exports.register_post = async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({message: "error when register", errors})
    // }
    // [
    //   check('username', "Username cannot be empty").notEmpty(),
    //   check('password', "Password must be more than 7 characters and less than 20 characters").isLength({min:7, max:20})
    // ]
    const {username, email, password} = req.body;
    let user = await User.findOne({email});

    if (user) {
        req.session.error = "User already exists";
        return res.redirect("/register");
    }
    const hasdPsw = await bcrypt.hash(password, 12);

    // const  userRole = await Role.findOne({value: "USER"})
    user = new User({
        username,
        email,
        password: hasdPsw,
        roles: ["USER"]
    });

    await user.save();
    // if(!error)
    // req.flash('message', 'Registered successfully')

    res.redirect("/login");
};

exports.main_get = async (req, res) => {
    const reviews = await Review.find().populate('user').populate({
        path: 'comments',
        model: 'Comment',
        populate: {path: 'user', model: 'User'}
    })

    res.render('main', {reviews: reviews});

    // try {

    //   res.json(('sss'))
    // } catch (error) {
    //   console.log(error)
    // }
};

exports.userprofile_get = (req, res) => {
    // const username = req.session.username;
    // const email = req.session.email;
    if (req.session.user) {
        // res.render('user-profile', { data : req.session.body });
    } else {
        res.send("Unauthorize User")
        // res.render('user-profile', { user : req.session.username });

    }

};

// exports.dashboard_get = (req, res) => {
//     const username = req.session.username;
//     res.render("main", { name: username });
//   };

// exports.dashboard_get('/dashboard', function(req, res, next) {
//   var username1 = req.session.username1;
//   res.render("dashboard", { name: username1 });
// })

exports.settings_page = async (req, res) => {
    const user = await User.findOne({email: req.session.user.email})
    res.render('account-settings', {user: user})
}

exports.settings_post = async (req, res) => {
    try {
        await User.findOneAndUpdate({email: req.session.user.email},
            {
                email: req.body.email,
                username: req.body.nickname,
            })
        res.redirect('/account-settings');
    } catch (e) {
        console.log(e)
    }
}

exports.change_password = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const isMatch = await bcrypt.compare(req.body.current, user.password)
        if (isMatch) {
            const hasdPsw = await bcrypt.hash(req.body.new, 12);
            await User.findOneAndUpdate({email: req.session.user.email},
                {
                    password: hasdPsw,
                })
            res.redirect('/account-settings');
        } else {
            res.send('Incorrect password')
        }
    } catch (e) {
        console.log(e)
    }
}

exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/login");
    });
};

exports.admin_users = async (req, res) => {
    const var1 = await Question.find()
    console.log(var1)
    const users = await User.find()
    res.render('all-users', {users: users});
};

exports.user_edit = async (req, res) => {
    const user = await User.findOne({_id: req.params.id})
    res.render('user-edit', {user: user});
};

exports.user_update = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id: req.params.id},
            {
                email: req.body.email,
                username: req.body.nickname,
                roles: req.body.roles
            })
        res.redirect('/admin-users');
    } catch (e) {
        console.log(e)
    }
};

exports.user_delete = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if (user.roles.includes("ADMIN")) {
            res.send("You cannot delete this user because he has an Admin Role")
        } else {
            await User.deleteOne({_id: req.params.id})
            res.redirect('/admin-users');
        }
    } catch (e) {
        console.log(e)
    }
};

exports.sat1 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "SAT Variant1") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};

exports.sat2 = async (req, res) => {
    const variant2 = await Question.find()
    let neededVar = []
    variant2.forEach(function (v) {
        if (v.dependent === "SAT Variant2") {
            neededVar.push(v)
        }
    })

    res.render('mcq', {variant: neededVar});
};

exports.check_answers = async (req, res) => {
    try {
        const id = req.params.id
        const quiz = await Question.find();
        let neededVar = []
        quiz.forEach(function (v) {
            if (v.dependent === id) {
                neededVar.push(v)
            }
        })
        const answers = req.body
        const correct = []
        const ansArr = []
        const result = Object
            .entries(answers)
            .map(entry => ({[entry[0]]: entry[1]}));
        let count = 0;
        neededVar.forEach(function (q) {
            ansArr[count] = Object.values(result[count])[0]
            if (Object.values(result[count])[0] === q.answer) {
                correct[count] = 1
            } else
                correct[count] = 0
            count++
        })
        const user = await User.findOne({email: req.session.user.email})
        await Passed.create({
            name: neededVar[0].dependent,
            quiz: neededVar,
            user: user,
            correct: correct,
            answers: ansArr
        })
        res.render('review', {variant: neededVar, correct: correct, ans: ansArr})
    } catch (e) {
        console.log(e)
    }
};

exports.review = async (req, res) => {
    try {
        const passed = await Passed.findOne({_id: req.params.id}).populate('user').populate('quiz')
        res.render('review', {variant: passed.quiz, correct: passed.correct, ans: passed.answers})
    } catch (e) {
        console.log(e)
    }
};

exports.passed = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const pass = await Passed.find().populate('user').populate('quiz')
        res.render('passed', {user: user, pass: pass})
    } catch (e) {
        console.log(e)
    }
}

exports.postReview = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})

        await Review.create({
            title: req.body.title,
            text: req.body.text,
            user: user
        })
        res.redirect('back')
    } catch (e) {
        console.log(e)
    }
}

exports.postComment = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const review = await Review.findOne({_id: req.params.id})

        const comment = await Comment.create({
            text: req.body.text,
            user: user,
            review: review
        })
        await Review.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {comments: comment}})
        res.redirect('back')
    } catch (e) {
        console.log(e)
    }
}