const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.welcome = async (req, res, next) => {
    try {
        res.status(200).json({message : 'Welcome to Node and Mongo Project'});
    } catch(err) {
        if (!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    }
}

exports.buildData = async (req, res, next) => {
    try {
        /** add default record in user collection */
        const hashedPw = await bcrypt.hash('123456', 12);
        var user = new User({
            username: 'Admin',
            first_name : 'William',
            last_name : 'Mates',
            email : 'testing@gmail.com',
            password : hashedPw,
        });

        await user.save();
        /** end of adding default record in user collection */
        
        res.status(200).json({message : 'Data Added Successfully'});
    } catch(err) {
        if (!err.statusCode)
            err.statusCode = 500;
        
        next(err);
    }
}