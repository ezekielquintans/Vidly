module.exports = function(req, res, next){
    // 401 Unauthorized  - Used when theres no authentication
    // 403 Forbidden - Permission related
    
    if( !req.user.isAdmin ) return res.status(403).send('Access denied.');
    
    next();
};