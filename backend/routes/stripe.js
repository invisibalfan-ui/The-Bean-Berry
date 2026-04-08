const router = require('express').Router()
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET)

router.post('/checkout', async (req, res) => {
  const { items } = req.body

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Apple Pay / Google Pay auto-enabled
    line_items: items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name },
        unit_amount: i.price * 100
      },
      quantity: 1
    })),
    mode: 'payment',

    // IMPORTANT:
    automatic_tax: { enabled: true },

    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`
  })

  res.json({ url: session.url })
})

module.exports = router