
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../services/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return res.status(400).send('Webhook signature missing');
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${(error as Error).message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.order.create({ data: { email: session.customer_email || '', total: Number(session.amount_total || 0) / 100 } });
  }
  res.json({ received: true });
}
