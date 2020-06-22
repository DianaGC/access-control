const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles');

exports.authorizeRole = function(action, resource) {
    return async (req, res, next) => {
     try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
     } catch (error) {
      next(error)
     }
    }
}
    
exports.verifyLoggedUser = async (req, res, next) => {
    console.log('???????')
    try {
     const user = res.locals.loggedInUser;
     console.log('???????uuuuuu',user)
     if (!user)
      return res.status(401).json({
       error: "You need to be logged in to access this route"
      });
      req.user = user;
      next();
     } catch (error) {
      next(error);
     }
}

const hashPassword = async pass => await bcrypt.hash(pass, 10);

const validatePassword = async (plainPassword, hashedPassword) => await bcrypt.compare(plainPassword, hashedPassword);

exports.signup = async(req, res, next) =>{
    try {
        const { username, password, role, skills } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
             username, 
             password: hashedPassword, 
             role: role || "employee",
             skills: skills
        });
        console.log('*****--',newUser)
        const accessToken = jwt.sign(
            { userId: newUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );
        console.log('*****-->>',accessToken)
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({
         data: newUser,
         accessToken
        })
       } catch (error) {
        next(error)
       }
}

exports.login = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) return next(new Error('Username does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'))
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({
        data: { username: user.username, role: user.role, skills: user.skills },
        accessToken
        })
        } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    console.log('+++++++++-------++++++----+++')

    try{
        const users = await User.find({});
        res.status(200).json({
            data:users
        })
    }catch ( error ) {
        next(error)
    }
}

exports.getUser = async (req, res, next) => {
    try{
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if(!user) return next(new Error("User does not exist"));
        res.status(200).json({
            data:user
        });
    }catch ( error ) {
        next(error)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
     const update = req.body
     const userId = req.params.userId;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
    
   exports.deleteUser = async (req, res, next) => {
    try {
     const userId = req.params.userId;
     await User.findByIdAndDelete(userId);
     res.status(200).json({
      data: null,
      message: 'User has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }