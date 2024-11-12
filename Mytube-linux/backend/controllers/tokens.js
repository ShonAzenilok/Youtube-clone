const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/users");
const { uploadProfilePics } = require("../multer");

const createJWT = async (req, res) => {
    const ID = req.body.id;
    const userID = { id: ID };

    const token = jwt.sign(userID, process.env.JWT_KEY, {
        expiresIn: "1h",
    });
    res.status(201).json({ token: token });
};

//send a id payload and check the token
const getJWT = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        try {
            const user = await User.findById("000000000000000000000000");
            return res.json(user); // Use return to ensure no further response is sent
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        try {
            const user = await User.findById(decoded.id); // Assuming the payload contains the user ID in `id`
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user); // Use return to ensure no further response is sent
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};

const login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: "Invalid Username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Respond with user data
        //**I can't seem to fit the data i get from the server to the one on the app */
        //**Need to change -> res.status(200).json({ _id: user._id, ...user.toObject() }); */
        res.status(200).json({ user: { _id: user._id, ...user.toObject() } });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const register = async (req, res) => {
    const { userName, password, passwordValidation, publicName } = req.body;
    const profilePicPath = req.files['profilePic'] ? req.files['profilePic'][0].path : null;

    if (!userName || !password || !passwordValidation || !publicName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordValidation) {
        return res.status(400).json({ message: "Passwords do not match" });
    }


    try {
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "UserName already exists" });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            password: hashedPassword,
            publicName,
            profilePicPath: profilePicPath,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Error registering user:', error); // Log error for debugging
        if (!res.headersSent) {
            res.status(500).json({ message: "Error registering user" });
        }
    }
};

module.exports = {
    createJWT,
    getJWT,
    register,
    login,
};