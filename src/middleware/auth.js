const jwt = require('jsonwebtoken')

const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization', 'Bearer Token')
        if (!token) {
            return res.status(403).send({ status: false, message: 'Missing authentication token in request' })
        }
        let splitToken = token.split(' ')

        let decodeToken = jwt.decode(splitToken[1], 'Book-Inventory')
        if (Date.now() > (decodeToken.exp) * 1000) {
            return res.status(403).send({ status: false, message: 'Token Expired, please login again' })
        }

        let verify = jwt.verify(splitToken[1], 'Book-Inventory')
        if (!verify) {
            return res.status(403).send({ status: false, message: 'Invalid authentication token in request header' })
        }
        
        req.userId = decodeToken

        next()
    } 
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.auth = auth