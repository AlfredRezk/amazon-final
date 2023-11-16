const User = require('../models/User');

module.exports = async(req, res, next)=>{
    req.user = req.session.user;
    res.locals.isAuth = req.session.isLoggedIn;
    // User role
    res.locals.isAdmin = req.session?.user?.role==='admin';
    const user = await User.findOne({_id: req.session?.user?._id})
    const userCartTotal = user?.cart?.products?.reduce((acc, curr)=> acc+curr.qty, 0) || '0';
    res.locals.cart = userCartTotal;
  
    res.locals.errorMessage = req.flash('error')
    res.locals.successMessage = req.flash('success')
    next()
  }