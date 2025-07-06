import User from "../model/User.model.js";
import crypto from 'crypto';  // node js has default module crypto
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const registerUser = async (req,res)=>{

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
            res.status(400).json({
                message : "Already existing user"
            })
        }
        // creata a user in db
        const user = await User.create({
            name,
            email,
            password
        })
         console.log("new user : ", user);
        if(!user){
            res.status(400).json({
                message : "User not registered"
            })
        }
        
         //create a verification token
        const token  =  crypto.randomBytes(32).toString("hex");
        console.log("token : ", token);
        user.verificationToken = token;

         //save token in db
        await user.save();

        // send token as email to user

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    const mailOption = {
            from: process.env.MAILTRAP_SENDERMAIL,
            to: user.email,
            subject: "Verify your email",
            text: `Please click on the following link 
                    ${process.env.BASE_URL}/api/v1/users/verify/${token}`, 
          
    };
       await transporter.sendMail(mailOption);
   
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

const verifyUser = async (req,res)=>{
    // get token from url
    //validate
    //find user based  on token
    //if not
    //set isverified field to true
    //remove verification token
    //save
    //return response

    const {token} = req.params;
    console.log("token : " ,token);
    if(!token){
        return res.status(400).json({
            message: "Invalid token",
        })
    }

    const user = await User.findOne({verificationToken : token});

    if(!user){
        return res.status(400).json({
            message: "Invalid token",
        })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

}

const login = async (req,res)=>{
      const {email,password} = req.body;

      if(!email || !password){
        return res.status(400).json({
            message : "All fields are required"
        })
      }

      try {
        const user = await User.findOne({email});
      if(!user){
        return res.status(400).json({
            message : "Invalid email or password"
        })
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if(!isMatch){
        return res.status(400).json({
            message : "Invalid email or password"
        })
      }

      const token = jwt.sign(
        {id : user._id,role : user.role},
        "shhhhh",
        {expiresIn : '24h'}
      );
      const cookieOptions = {
        httpOnly : true,
        secure : true,
        maxAge : 24*60*60*100
      }
      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        success : true,
        message : "Login successful",
        token,
        user : {
            id : user._id,
            name : user.name,
            role : user.role
        }
      })
        
      } catch (error) {
        return res.status(400).json({
            message : "Login unsuccessful",
            error
        })
        
      }
}

export {registerUser, verifyUser, login};