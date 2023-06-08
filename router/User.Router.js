const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.Model');
const sendEmail = require('../mail/NodeMailer');



const app = express();
const UserRouter = express.Router();
UserRouter.use(express.json());

// Register route

UserRouter.post('/register', async function (req, res) {
    const { username, email, password } = req.body;
    console.log(req.body);

    try {
        // checking validation by email if user already present
        let user = await UserModel.find({ email });
        if (user.length > 0) res.send(`useralready registration ${username}`);
        else
            // hashing the password
            bcrypt.hash(password, 6, async function (err, hash) {
                if (err) res.send(`error in register ${username}`);
                else {
                    // creating new user's registration
                    let newUser = new UserModel({
                        username,
                        email: email,
                        password: hash,
                    })
                    console.log(newUser);
                    // saving user in database
                    await newUser.save();
                    res.status(201).send({ message: `User registration successfully done 😊 `, newUser })
                }
            });


    } catch (error) {
        console.log(error.message);
        res.status(404).send({ message: `User registration failed 😑 ` })

    }

});


// Login route 
UserRouter.post('/login', async function (req, res) {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        // checking user by email
        let user = await UserModel.find({ email });
        console.log(user);

        if (user.length === 0) {
            res.status(400).send({ message: `User doesn't exists need to register plz 😑 ` })
        } else {
            let hash_pass = user[0].password;
            console.log(hash_pass);

            bcrypt.compare(password, hash_pass, async function (err, result) {
                if (result) {
                    const otp = Math.round(Math.random() * 9999) + '';
                    console.log(otp);
                    sendEmail({ email: email, subject: "Login from this otp", body: otp });

                    // token
                    const token = jwt.sign({ userId: user[0]._id }, "chat", { expiresIn: '7d' })
                    console.log(token);
                    res.status(201).send({ message: `User login Successfully  `, token, user, otp });
                } else {
                    res.status(400).send({ message: `error while login sorry 😑 `, err: err.message });
                }
            })



        }


    } catch (error) {
        console.log(error.message);
        res.status(404).send({ message: `User login failed 😑 ` })
    }


});


module.exports = UserRouter;
