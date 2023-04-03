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

router.post('/api/products', authMiddleware, async (req, res, next) => {
  try {
    // Code to create a new product goes here
    const { name, description, pictureUrl, category, originalPrice, startDate, endDate, sellerId } = req.body
    const product = await Product.create({
      name,
      description,
      pictureUrl,
      category,
      originalPrice,
      startDate,
      endDate,
      sellerId : req.user.id
    })
    res.status(201).send('Product created successfully')
  } catch (error) {
    next(error)
  }
})

router.put('/api/products/:productId', async (req, res) => {
  try{
    const { productId } = req.params
    const { name, description, pictureUrl, category, originalPrice, startDate, endDate, sellerId } = req.body
    const product = await Product.update({
      name,
      description,
      pictureUrl,
      category,
      originalPrice,
      startDate,
      endDate,
      sellerId : req.user.id
    }, {
      where: { id: productId }
    })
    res.status(200).send('Product updated successfully')
  }catch(error){
    next(error)
  }
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
