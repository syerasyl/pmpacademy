module.exports = (req, res, next) => {
    console.log(req.session.user)
    if (req.session.isAuth && req.session.user.roles.includes("ADMIN")) {
        next();
    } else {
        res.send("You don't have an Admin role!")
    }
};


// const { db } = require("../models/User");

// module.exports.isAdmin = (req, res, next) => {
//     db.collection('users').findOne({
//         username: req.session.username
//     }).then((user) => {
//         if (!user) {
//             res.status(500).send({ message: err });
//             return;
//         }
//         else {
//             if (user.role === 'admin') {
//                 res.redirect("/admin")
//             }
//             else {
//                 res.redirect('/main')
//             }
//         }

//     });
// };