import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          as : 'bids',
          model: Bid,
          include: [
            {
              as : 'bidder',
              model: User,
              attributes: ['id', 'username']
            }
          ]
        }
      ]
    })
    res.status(200).send(products)
  } catch (error) {
    next(error)
  }
})

router.get('/api/products/:productId', async (req, res) => {
  const { productId } = req.params
  const product = await Product.findOne({
    where: { id: productId },
    include: [
      {
        as : 'bids',
        model: Bid,
        include: [
          {
            as : 'bidder',
            model: User,
            attributes: ['id', 'username']
          }
        ]
      }
    ]
  })
  res.status(200).send(product)
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', (req, res) => {
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
