import User from "../model/User.model.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
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

export {registerUser, verifyUser};