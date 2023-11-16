const router = require('express').Router();
const {getProducts, getProduct, postCart, getCart, deleteCart, addCart, removeCart}= require('../controllers/products');
const { protect } = require('../middlewares/auth');

router.get("/",getProducts);
router.post('/cart', protect, postCart)
router.get('/cart', protect, getCart)
router.get('/cart/delete/:prodId', protect, deleteCart)
router.get('/cart/add/:prodId', protect, addCart)
router.get('/cart/remove/:prodId', protect, removeCart)
router.get('/:prodId', protect,  getProduct)


module.exports = router;
