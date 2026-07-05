const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Helper function for JWT creation
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    //  Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    //  Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //  Generate token
    const token = createToken(user._id);

    //  Send success response
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in login controller",
      error: error.message,
    });
  }
};



exports.registerController = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Validate required fields
        if (!email || !name || !password) {
            return res.status(400).json({
                success: false,
                message: "Email, name, and password are required",
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        //  Check if user already exists
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({
                success: false,
                message: "User already registered",
            });
        }

        //  Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Create and save user
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        //  Respond
        res.status(201).json({
            success: true,
            message: "Successfully registered",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in register controller",
            error: error.message,
        });
    }
};




exports.adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if ( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email },process.env.JWT_SECRET,{ expiresIn: "1d" } );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in Admin Login Controller",
      error: error.message
    });
  }
};
