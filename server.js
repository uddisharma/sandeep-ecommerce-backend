require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connMongoose } = require('./config/db');
const connectCloudinary = require('./config/cloudinary'); 
const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/productRouter');
const cartRouter = require('./Router/cartRouter');
const orderRouter = require('./Router/orderRouter');

const app = express();

// ─────────────── Middleware ───────────────
app.use(cors()); 
app.use(express.json());
app.use(morgan('dev'));

// ─────────────── Connect to DB & Cloudinary ───────────────
connMongoose();
connectCloudinary();

// ─────────────── Basic Route ───────────────
app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.use('/api/user',userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);

// ─────────────── Start Server ───────────────
const HOST_NAME = process.env.HOST_NAME || '127.0.0.1';
const PORT = process.env.PORT || 8080;

app.listen(PORT, HOST_NAME, () => {
  console.log(`🚀 Server started at http://${HOST_NAME}:${PORT}`);
});
