
// Protect routes 
exports.protect = (req, res, next)=>{
   
    // If logged in user will allow him to access routes
    if(req?.user) next()
    else res.redirect('/auth/login');
}

// Grant access to specific roles 
exports.authorize = (...roles)=> (req, res, next)=>{

    if(!roles.includes(req.user.role)) 
    
        res.redirect('/')
    else
        next()
}

