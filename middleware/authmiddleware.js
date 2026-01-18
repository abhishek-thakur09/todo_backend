const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    // find out the token from cookie
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "not authenticated"});
    }

    try{
        const check = jwt.verify(token, process.env.JWT_KEY);
        req.userId = check.userId;//then user is logged in
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid token"});
    }

}