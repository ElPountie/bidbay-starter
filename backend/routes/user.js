import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params
  const user = await User.findOne({
    where: { id: userId },
    include: [
      {
        as : 'products',
        model: Product,
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
      }
    ]
  })
  res.status(200).send(user)
})

export default router
