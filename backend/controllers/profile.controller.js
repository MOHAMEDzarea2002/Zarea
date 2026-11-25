const User = require('../models/auth.model')
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({user})
  }catch(error){
   return res.status(500).json({ error: 'internal server error' })
  }
}
module.exports = { getProfile }
