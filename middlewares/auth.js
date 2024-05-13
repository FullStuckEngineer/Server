const prisma = require("../lib/prisma")
const {verifyToken} = require("../lib/jwt")

const authentication = async (req, res, next) => {
    try {
        
        const authorization = req.headers.authorization

        if (authorization){
            const token = authorization.split(" ")[1]
            
            const decoded = verifyToken(token)
            if(decoded){
                const user = await prisma.user.findUnique({
                    where: {
                        id: decoded.id
                    }
                })
                if (user){
                    req.loggedUser = {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                    next()
                }else{
                    throw {name: "InvalidCredentials"}  
                }
                
            }else{
                throw {name: "JWTERROR"}
            }

        }else{
            throw {name: "Unauthenticated"}
        }

    } catch (err) {
        next(err)
    }
}

const authorization =  (params) => {

   return   (req,res,next) => {
    try {

        if (params.includes(req.loggedUser.role)){
            next()
        } else {
            throw {name: "Unauthorized"}
        }
  
    } catch (err) {
        next(err)
    }
}
}

module.exports = { authentication, authorization }
