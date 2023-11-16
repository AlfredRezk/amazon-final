const Product = require('../models/Product');
const validation = require('../utils/validation');

let inputs = {};
// @URL     GET /admin/add
// @access  Private
// @desc    Get the add form page
exports.getAdd = (req, res) => {

  res.render("pages/add", { docTitle: "ADD PRODUCT" , product: inputs});
};


// @URL     POST /admin/add
// @access  Private
// @desc    Store the product in DB
exports.postAdd = async (req, res) => {
  inputs = req.body;


  // validation 
  // const error = validation(req, res)
  // console.log(error)
  // if(error)
  //   return res.redirect("/admin/add");
  // Include the current logged in user id to the form data 
  req.body.userId = req.user._id;
  req.body.image = `/uploads/${req.file.filename}`
  const product = new Product(req.body)
  await product.save()

  // await Product.create(req.body);
  res.redirect("/");
};


// @URL     GET /admin/products
// @access  Private
// @desc    Get Products from DB
exports.getProducts = async(req, res)=>{
  // Find products created by current logged in user.
  const products = await Product.find({userId:req.user._id});
  res.render('pages/admin-products', {products, docTitle:'Admin Products'})
}


// // @URL     GET /admin/delete/:prodId
// // @access  Private
// // @desc    Delete Product
// exports.getDelete = async(req, res)=>{
//   const id = req.params.prodId;
//   console.log(id);
//   await Product.deleteOne({_id:id, userId:req.user._id})
//   //await Product.findByIdAndDelete(id);
//   req.flash('success', 'Product Deleted!');
//   res.redirect('/admin/products')
// }

// @URL     POST /admin/delete
// @access  Private
// @desc    Delete Product
exports.postDelete = async(req, res)=>{
  const id = req.body.id;
  await Product.deleteOne({_id:id, userId:req.user._id})
  //await Product.findByIdAndDelete(id);
  req.flash('success', 'Product Deleted!');
  res.redirect('/admin/products')
}

// @URL     Get /admin/edit/:prodId
// @access  Private
// @desc    Render the edit form
exports.getEdit = async(req, res)=>{
  const id = req.params.prodId;
  // Fetch the product 
  const product = await Product.findById(id);
  // Edit flag 
  const editMode = Boolean(req.query.edit)
  res.render('pages/add', {product, editMode, docTitle:'Edit Product'})
}

// @URL     POST /admin/edit
// @access  Private
// @desc    Process the edit form 
exports.postEdit = async(req, res)=>{
  const id = req.body.id;
  inputs = req.body;
    // validation 
    const error = validation(req, res)
    if(error)
      return res.redirect(`/admin/edit/${id}`);

  const product = await Product.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})
  console.log(product);
  req.flash('success', 'Product Updated!');
  res.redirect('/admin/products')
}


