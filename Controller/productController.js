const { v2: cloudinary } = require('cloudinary');
const Product = require('../Models/productModels');

exports.addProduct = async(req,res)=>{
    try {
        const {name, description, price,category,subCategory,size, bestseller} =req.body;
        
        if(!name || !description || !price || !category || !subCategory || !size || !bestseller){
            return res.status(404).json({
                success:false,
                message:"All fields Are Required"
            })
        }


        const image1 =req.files.image1 && req.files.image1[0];
         const image2 =req.files.image2 && req.files.image2[0];
         const image3 =req.files.image3 && req.files.image3[0];
         const image4 =req.files.image4 && req.files.image4[0];

         const images = [image1,image2,image3,image4].filter((item) =>item !== undefined)

         let imageUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
            })
         )

        const productData = {
            name,
             description,
              price:Number(price),
              category,
              subCategory,
              size: JSON.parse(size),
               bestseller:bestseller ==="true" ? true : false,
               image:imageUrl,
               date:Date.now()
            }
          console.log(productData)

          const product = new Product(productData).save();

          res.status(200).json({
            success:true,
            message:"SuccessFully Added",
            product
          })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:"Error in AddProduct Controller",
        })
    }
}


exports.listProduct = async (req, res) => {
  try {
    const product = await Product.find({});

    return res.status(200).json({
      success: true,
      message: "Get all products successfully",
      product
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error in List Product Controller"
    });
  }
};


exports.removeProduct = async (req, res) => {
  try {
    const {id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      product
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Remove Product Controller"
    });
  }
};


exports.singleProduct = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get single product successfully",
      product
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in Single Product Controller"
    });
  }
};

