import User from '../model/User.model.js';
const getUserData = async(req,res) => {
  try {
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json(
            { 
                message: 'User not found', 
                status: 'false' 
            });
        }
        return res.status(200).json(
            { 
                success: true,
                userData: {
                    name: user.name,
                    isAccountVerified: user.isVerified,
                }, 
                status: 'true' 
            });

    
  } catch (error) {
      return res.status(500).json({ message: error.message, status: 'false ' });
    
  }
}

export {getUserData} 