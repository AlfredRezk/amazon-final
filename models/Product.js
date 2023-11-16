const {Schema, model} = require('mongoose');

const productSchema = new Schema({
   userId:{
        type: Schema.ObjectId,
        ref:'User', 
        required:true
   }, 
    title: {
        type: String, 
        required: [true, 'Title is required'],
        minLength: [5, 'Title is 5 Characters min'], 
        maxLength: [20, 'Title is 20 characters max']
    }, 
    price:{
        type: Number, 
        required: true, 
    } ,
    description:{
        type: String, 
        required: true, 
    } ,
    image: {
        type: String, 
        default: 'https://image.com', 
        // // match: [/^http(s)?\:\/\/.*/i, 'Please add a valid url']
    }, 
})

// productSchema.path('image').validate(function(){
//     let pattern = /^http(s)?\:\/\/.*/i;
//     return pattern.test(this.image);
// }, 'Must br a valid url')


module.exports = model('Product', productSchema);