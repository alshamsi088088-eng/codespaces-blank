
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../services/prisma.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function getStoreItems(_req: Request, res: Response) {
  const books = await prisma.book.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ books });
}

export async function getUserOrders(req: Request, res: Response) {
  const user = req.user as any;
  if (!user?.email) return res.status(401).json({ message: 'Unauthorized' });
  const orders = await prisma.order.findMany({ where: { email: user.email }, orderBy: { createdAt: 'desc' } });
  res.json({ orders });
}

export async function checkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;
    const products = await prisma.book.findMany({ where: { id: { in: items.map((item: any) => item.id) } } });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: (req.user as any)?.email || undefined,
      line_items: products.map((book: any) => ({ price_data: { currency: 'usd', product_data: { name: book.title, description: book.summary }, unit_amount: Math.round(book.price * 100) }, quantity: 1 })),
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/store`
    });
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
}
