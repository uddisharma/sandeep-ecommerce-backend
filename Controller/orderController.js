const orderModel = require("../Models/orderModel");
const User = require("../Models/userModels");
const Stripe = require('stripe');


const currency = 'inr';
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing Order using COD Method
const placeOrder = async (req,res)=>{
    try {
        const userId = req.userId;  // correct
        const { items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: 'Error In Place Orders'
        });
    }
}

//placing Order using stripe Method
const placeOrderStrip = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error In Place Orders stripe",
    });
  }
};


//placing Order using Razorpay Method
const placeOrderRazorpay = async (req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:'Error In Place Orders Razorpay'
        })
    }
}

// All order data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({
      success: true,
      message: 'All orders update For Admin Panel',
      orders
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'Error In Place Orders'
    });
  }
};


//user Order for Data Frontend
const userOrders = async (req,res)=>{
    try {
       const userId = req.userId;
        
        const orders = await orderModel.find({userId});
        res.status(200).json({
            success:true,
            message:"get Orders Successfully",
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:'Error In User Orders'
        })
    }
}

//update Order Status from Admin panel
const updateStatus = async (req,res)=>{
    try {
        const {orderId, status}= req.body;
        const ordersUpdate = await orderModel.findByIdAndUpdate(orderId,{status});

        res.status(200).json({
            success:true,
            message:"get Orders update Successfully",
            ordersUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success:false,
            message:'Error In Place Orders'
        })
    }
}

module.exports = {
  placeOrder,
  placeOrderStrip,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};