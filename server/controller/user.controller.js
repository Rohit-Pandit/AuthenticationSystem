import User from "../model/User.model.js";
import crypto from 'crypto';  // node js has default module crypto
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";


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
            return res.status(400).json({
                message : "User is not able to create an account"
            })
        }
        
         //create a verification token
       const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
       );
        

        res.cookie('token',
                    token,
                   {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    maxAge : process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000  // in milliseconds

                   }
        )

        // welcome email to user

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Welcome to our App",
            text : `Hello ${user.name},\n\nWelcome to our application! We're excited to have you on board.\n\nBest regards,\nThe Team`
        };

       try{
           await transporter.sendMail(mailOptions);
           console.log("Welcome email sent!");
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr.message);
        }

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
const login  = async (req,res)=>{
    const {email,password} = req.body;

    // validate
    if(!email || !password){
        return res.status(400).json({
            message : "Email and Password are required",
            success : false
        });
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "Invaid email, user not found",
                success : false
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message : "Invalid Password",
                success : false
            });
        }
        // create a jwt token
        console.log("🔐 login jwt secret:", process.env.JWT_SECRET);
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
       );

        res.cookie('token',    
                    token,
                   {
                    httpOnly : true,
                    secure : process.env.NODE_ENV === 'production',
                    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    maxAge : process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000  // in milliseconds
                     }
        )

        return res.status(200).json({
            message : "Login successful",
            success : true,
            user : {
                name : user.name,
                email : user.email,
                id : user._id
            },
            Token : token   
        });

    } catch (error) {
        console.error("❌ JWT Verify Error:", error.message);
        return res.status(500).json({
            message : "Error in login",
            success : false,
            error
        });
    }
};
const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production', 
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({
            message : "Logout successful",
            success : true,

        });
    } catch (error) {
        return res.status(500).json({
            message : "Error in logout",
            success : false,    
            error
        });
        
    }
};

const sendVerificationEmailOtp = async (req, res) => {
    try{
        const userId = req.userId;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false
            });
        }
        if(user.isVerified){
            return res.status(400).json({
                message : "User is already verified",
                success : false
            });
        }
        // generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // save otp and expiry to user
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = otpExpiry;
        await user.save();

        // send otp to user's email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Email Verification OTP",
            // text : `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };  
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message : "Verification OTP sent to email",
            success : true
        });


    }
    catch(error){   
       return res.status(500).json({
            message : "Error in sending verification email",
            success : false,
            error
        });
    }
};

const verifyEmailOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const {otp} = req.body;
        if(!otp){
            return res.status(400).json({   
                message : "OTP is required",
                success : false
            });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false
            });
        }
        if(user.isVerified){
            return res.status(400).json({
                message : "User is already verified",
                success : false
            });
        }
        if(user.verifyOtp==='' || user.verifyOtp !== otp){
            return res.status(400).json({
                message : "Invalid OTP",
                success : false
            });
        }
        if(Date.now() > user.verifyOtpExpiryAt){
            return res.status(400).json({
                message : "OTP has expired",
                success : false
            });
        }
        // mark user as verified
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;
        await user.save();

        return res.status(200).json({
            message : "Email verified successfully",
            success : true
        });
        
    } catch (error) {
        return res.status(500).json({
            message : "Error in verifying email OTP",
            reason: error.message,
            success : false,
            error
        });
        
    }
};

const isAuthenticated = (req,res)=>{
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({
                message : "Unauthorized access",
                success : false
            });
        }
        return res.status(200).json({
            message : "User is authenticated",
            success : true,
            userId 
        });
        
    } catch (error) {
        return res.status(500).json({
            message : "Error in authentication",
            success : false,    
            error
        });
        
    }
};

const sendResetPasswordOtp = async (req, res) => {
    // Implementation for sending reset password OTP
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            message : "Email is required",
            success : false
        });
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false
            });
        }
        // generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        // save otp and expiry to user
        user.resetOtp = otp;
        user.resetOtpExpiryAt = otpExpiry;
        await user.save();
        // send otp to user's email
        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : email,     
            subject : "Password Reset OTP",
            // text : `Your OTP for password reset is ${otp}. It is valid for 10 minutes.,`
            html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };  
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            message : "Reset password OTP sent to your email",
            success : true
        });

    }
    catch (error) {
        return res.status(500).json({
            message : "Error in sending reset password OTP",
            success : false,
            error
        });
    }       
};

const resetPassword = async (req, res) => {
    // Implementation for resetting password
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.status(400).json({
            message : "Email, OTP and new password are required",
            success : false
        });
    }
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false
            });
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.status(400).json({
                message : "Invalid OTP",
                success : false
            });
        }   
        if(Date.now() > user.resetOtpExpiryAt){
            return res.status(400).json({
                message : "OTP has expired",
                success : false
            });
        }
        // update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;
        await user.save();
        return res.status(200).json({
            message : "Password reset successfully",
            success : true
        });
    } catch (error) {
        return res.status(500).json({
            message : "Error in resetting password",
            success : false,
            error
        });
    }
};

export {
    register, 
    login,
    logout ,
    sendVerificationEmailOtp,
    verifyEmailOtp,
    isAuthenticated,
    sendResetPasswordOtp,
    resetPassword
};