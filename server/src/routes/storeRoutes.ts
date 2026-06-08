
import { Router } from 'express';
import { checkout, getStoreItems } from '../controllers/storeController.js';
import { authGuard } from '../middleware/authGuard.js';

export const storeRoutes = Router();
storeRoutes.get('/', getStoreItems);
storeRoutes.post('/checkout', authGuard, checkout);
