const { verifyToken } = require('../helpers/token')
const { User, Todo } = require('../models')

async function authenticate(req, res, next) {
    try {
        console.log('>>> req.headers : ', req.headers)

        let decodedToken = verifyToken(req.headers.access_token)
        let user = await User.findOne({ where: { email: decodedToken.email } })
        // console.log('>>> decodedToken :', decodedToken)
        // console.log('>>> user :', user)

        if (!user) {
            // return res.status(401).json({ message: 'Please' })
            return next({ name: '401' })
        }

        if (user) {
            req.user = { id: user.id }
            // console.log('>>> req.user : ', req.user)
            return next()
        }

    } catch (err) {
        return next(err)
    }
}

async function authorize(req, res, next) {
    try {
        let id = +req.params.id
        // console.log('>>> id', id)
        // console.log('>>> req.user', req.user)

        let todo = await Todo.findByPk(id)
        
        if (!todo) {
            return next({ name: '404' })
        }
        
        if (todo.UserId !== req.user.id) {
            return next({ name: '403' })
        }

        return next()

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    authenticate, authorize
}