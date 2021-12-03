const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

const User = require('../models/user');
const { notFound, handleSuccessResponse, unauthorizedRequest, badRequest, validationError, recordExists } = require('../utils/response-helper');
const { pagination, isObjectIdValid } = require('../utils/helper');
const { recordsPerPage } = require('../utils/constants');


/**method to check whether login user is valid or not */
exports.login = async (req, res, next) => {
    try {
        let loadedUser;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw validationError(errors.errors[0].msg)
        }

        const {email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw notFound('A user with this email could not be found.');
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw unauthorizedRequest('Wrong Password');
        }

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );
        
        const data = {
            user : {
                id          : loadedUser._id.toString(),
                username    : loadedUser.username,
                email       : loadedUser.email,
                full_name   : loadedUser.first_name + ' ' + loadedUser.last_name
            },
            accessToken : token,
        }
        return handleSuccessResponse(res, data)

    } catch(err){
        if (!err.status)
            err.status = 500;
            
        next(err);
    }
}

/**method to fetch all record */
exports.getUsers = async (req, res, next) => {
    try {
        let {page, search} = req.query;
        const currentPage = parseInt(page) || 1;
        const perPage = recordsPerPage;
        let finalData = [];
        
        const query = { email: { $ne: 'testing@gmail.com' } }
        
        if (search) {
            query['$or'] = [
                { email: {'$regex' : search, '$options' : 'i'}},
                { username: {'$regex' : search, '$options' : 'i'}},
            ]
        }

        const totalItems = await User.find(query).countDocuments();
        const userData = await User.find(query)
                                    .sort({_id : -1})
                                    //.populate('role_id') //required when related data is needed
                                    .skip((currentPage - 1) * perPage).limit(perPage);

        if(userData){
            finalData = userData.map(obj => {
                return {
                    "id"            : obj._id,
                    "username"      : obj.username,
                    "first_name"    : obj.first_name,
                    "last_name"     : obj.last_name,
                    "email"         : obj.email,
                }
            });

            const paginationData = pagination(currentPage, totalItems, 'user');

            const data = {
                user    : finalData,
                ...paginationData
            }
            return handleSuccessResponse(res, data)
        }
        
        throw notFound('No Records Found')

    } catch(err){
        if (!err.status)
            err.status = 500;
            
        next(err);
    }
}

/**method for saving a new record */
exports.saveUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw validationError(errors.errors)
        }

        const {username, email, first_name, last_name, password} = req.body;
        
        const userExists = await User.findOne({ email: email });
        if (userExists)
            throw recordExists('A user with this email already exists.');

        const hashedPw = await bcrypt.hash(password, 12);
        
        var user = new User({
            username,
            first_name,
            last_name,
            email,
            password : hashedPw,
            created_by : req.userId //fetched from middleware
        });
        
        const result = await user.save();
        if(result){
            //sendEmail(); //send email

            return handleSuccessResponse(res, { data : 'User Created Successfully' });
        }
        
        throw badRequest('Some Error Occured');

    } catch(err){
        if (!err.status)
            err.status = 500;
            
        next(err);
    }
}

/**method to fetch a single record */
exports.getUser = async (req, res, next) => {
    try {
        const id = req.params.userId;
        if(!isObjectIdValid(id))
            throw notFound('Record Not Found.');

        let finalData = [];
        const userData = await User.findById(id);
        if(userData){
            finalData = {
                "id"            : userData._id,
                "username"      : userData.username,
                "first_name"    : userData.first_name,
                "last_name"     : userData.last_name,
                "email"         : userData.email,
            }

            const data = { user : finalData }

            return handleSuccessResponse(res, data);
        }
        
        throw notFound('No Record Found');

    } catch(err){
        if (!err.status)
            err.status = 500;

        next(err);
    }
}

/**method to update an existing record */
exports.updateUser = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw validationError(errors.errors)
        }
        
        const userId = req.params.userId;
        if(!isObjectIdValid(userId))
            throw notFound('Record Not Found.');

        const {username, email, first_name, last_name } = req.body;
        
        const user = await User.findById(userId);
        if(!user)
            throw notFound('No Records Found');
        
        user.username   = username;
        user.email      = email;
        user.first_name = first_name;
        user.last_name  = last_name;
        const result    = await user.save();

        if(result) {
            const data = { data : 'User Updated Successfully' }
            return handleSuccessResponse(res, data);
        }
            
        throw badRequest('Some Error Occured');

    } catch(err){
        if (!err.status)
            err.status = 500;
        
        next(err);
    }
}

/**method to delete record */
exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.userId;
        if(!isObjectIdValid(id))
            throw notFound('Record Not Found.');

        const user = await User.findByIdAndRemove(id);
        if(user){
            const data = {
                data : 'User Deleted Successfully'
            }
            return handleSuccessResponse(res, data);
        }
        

    } catch(err){
        if (!err.status)
            err.status = 500;

        next(err);
    }
}