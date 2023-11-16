const Product = require('../models/Product');
const User = require('../models/User');
// @URL     GET /
// @access  PUBLIC
// @desc    list all products
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.render("pages/home", { docTitle: "Home Page", products });  
};

// @URL     GET /:id
// @access  PUBLIC
// @desc    Get a specific product details 
exports.getProduct = async (req, res) => {

    const product = await Product.findById(req.params.prodId);
  res.render("pages/details", { docTitle: "Product Details", product });
};


// @URL     POST /cart
// @access  PRIVATE
// @desc    Add item to cart
exports.postCart = async(req, res)=>{
  const id = req.body.id;
  const product = await Product.findById(id)
  // Add the product to the user cart
  const user = await User.findById(req.user._id);

  await user.addToCart(product);
  req.flash('success', 'Product added to Cart!');
  res.redirect('/')
} 
// @URL     GET /cart
// @access  PRIVATE
// @desc    List cart items
exports.getCart= async(req, res)=>{


  let products = await User.findById(req.user._id).populate('cart.products.productId')
  products = products.cart.products
  console.log(products)
  const total = products.reduce((acc, prod)=> acc+prod.productId.price* prod.qty, 0)

  res.render('pages/cart', {docTitle:'Cart', products, total})

}


exports.deleteCart = async(req, res)=>{
  let user = await User.findById(req.user._id)
  
  user.cart.products = user.cart.products.filter(prod=> prod.productId.toString() !== req.params.prodId)
  user.save();
  req.flash("success", "product removed from cart");
  res.redirect('/cart')
}

exports.addCart = async(req, res)=>{
  let user = await User.findById(req.user._id)
  const products = user.cart.products;
  
   const index= products.findIndex(prod=> prod.productId.toString() == req.params.prodId)
  products[index].qty++
  user.cart.products = products
  user.save();
  req.flash("success", "product quantity increased");
  res.redirect('/cart')
}

exports.removeCart = async(req, res)=>{
  let user = await User.findById(req.user._id)
  const products = user.cart.products;
  
  const index= products.findIndex(prod=> prod.productId.toString() == req.params.prodId)
  
  console.log(products[index])
  if(products[index].qty==1){
    products.splice(index,1)
  

  }else{
    products[index].qty--
    user.cart.products = products  
  }

  user.save();
  req.flash("success", "product quantity decreased");
  res.redirect('/cart')
}
