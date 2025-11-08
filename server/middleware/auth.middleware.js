import jwt from 'jsonwebtoken';

export const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token missing",
            success : false
        });
    }   
    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id){
            req.userId = decoded.id;
        }
        else{
            return res.status(401).json({
                message : "Unauthorized access, invalid token",
                success : false
            }); 
        }
        next();
    } catch (error) {
       
        return res.status(401).json({
            message: "Unauthorized access, invalid token",
            reason: error.message,   // 👈 add this line for debugging
            success: false
        });
    }
};