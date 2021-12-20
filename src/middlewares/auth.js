import jwt from 'jsonwebtoken'
function checkAuth(req, res, next){
    
    try {
        const token = req.headers.authorization;
        const data = jwt.verify(token, process.env.JWT_SECRET)
        if (data){
            res.locals.username = data.username
            next()
        } 
        return;
      } catch(err) {
        console.log('error check auth', err)
        next(err)
      }
}

export {checkAuth};