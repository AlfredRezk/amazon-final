const {connect} = require('mongoose')

const connectDB = async()=>{
    try{
        await connect(process.env.MONGO_URI);
        console.log(`Connected to DB`.yellow.underline);
    }catch(error){
        console.log(error);
    }
 
}

module.exports = connectDB;