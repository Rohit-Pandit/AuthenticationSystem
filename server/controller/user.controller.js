import User from "../model/User.model.js";
import crypto from 'crypto';  // node js has default module crypto
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const register = async (req,res)=>{

    // get data 
    const {name,email,password} = req.body;

    // validate
    if(!name || !email || !password){
        return res.status(400).json({
            message : "All fields are required"
        });
    }

    // check if user already exists
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message : "Already existing user"
            })
        }
        // creata a user in db
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password : hashedPassword
        })
    
        console.log("new user : ", user);
        if(!user){
            res.status(400).json({
                message : "User is not able to create an account"
            })
        }
        
         //create a verification token
       const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
       );
        console.log("token : ", token);

        res.cookie('token',
                    token,
                   {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    maxAge : process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000  // in milliseconds

                   }
        )
        

         //save token in db
        await user.save();

       // send success status to user
       res.status(201).json({
        message : "User registered successfully",
        success : true
       })

    } catch (error) {
        res.status(400).json({
                message : "User not registered",
                error,
                success : false
            })
    }
    
    
}
const login  = async (req,res)=>{};
const logout = async (req,res)=>{};


export {
    register, 
    login,
    logout  
};