import jwt from 'jsonwebtoken'
function checkAuth(req, res, next){
    
    try {
        const token = req.headers.authorization;
        if (token === null || token === 'null') return res.json({success: false, message: 'You need to login to access this page'})
        
        const data = jwt.verify(token, process.env.JWT_SECRET)
        console.log(data);
        if (data){
            res.locals.username = data.username
            next()
        } 
      } catch(err) {
        console.log('error check auth', err)
        next(err)
      }
}

export {checkAuth};