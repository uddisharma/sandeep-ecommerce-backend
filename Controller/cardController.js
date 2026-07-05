const User = require("../Models/userModels");

const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;

    const userData = await User.findById(userId);
    let cartData = userData.cartData;

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(201).json({ success: true, message: "Add To Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};


//update user Cart
const updateCart = async (req, res) => {
    try {
      const { itemId, size, quantity } = req.body;
      const userId = req.userId;


     const userData = await User.findById(userId);
     let cartData = await userData.cartData;

     cartData[itemId][size] = quantity;

      await User.findByIdAndUpdate(userId,{cartData})

     res.status(201).json({
        success:true,
        message:"Cart Updated"
     })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
}


//get user cart Data
const getUserCart = async (req, res) => {
    try {
       const userId = req.userId;
       const userData = await User.findById(userId);
       let cartData = await userData.cartData;
       
       res.status(201).json({
        success:true,
        cartData
       })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
}

module.exports = {
    addToCart,
    updateCart,
    getUserCart
};