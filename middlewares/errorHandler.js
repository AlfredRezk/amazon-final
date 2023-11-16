module.exports = (error, req, res, next)=>{
    console.log(error)
    res.render('error', {docTitle: 'Error Page', message: error.message})
  }