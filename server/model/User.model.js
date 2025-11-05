import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    isVerified : {  //isAccountVerified
        type : Boolean,
        default : false
    },
   verifyOtp : { 
        type : String,
        default : ''
        
    },
    verifyOtpExpiryAt : { 
        type : Number,  
        default : 0 
    },
    resetOtp : {  
        type : String,
        default : ''
    },
    resetOtpExpiryAt : {  
        type : Number,  
        default : 0 
        
    }
}, {timestamps : true})

// userSchema.pre("save", async function(next){
//     if(this.isModified("password")){
//         this.password = await bcrypt.hash(this.password,10);
//     }
//     next();
// })

const User = mongoose.model("User", userSchema);
export default User