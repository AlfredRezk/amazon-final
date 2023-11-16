
const { validationResult } = require("express-validator");
module.exports = (req, res)=>{
    let results = validationResult(req)
    console.log(results)
    if(!results.isEmpty()){
        const {errors} = results
        req.flash('error', errors[0].msg)      
        return true
    } else{
        return false
    }
}