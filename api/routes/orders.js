import express from 'express';
const router = express.Router();

import checkAuth from '../middleware/check-auth.js';

import { orders_get_all } from '../controllers/orders.js';
import { create_order } from '../controllers/orders.js';
import { orders_get_order } from '../controllers/orders.js';
import { orders_delete_order } from '../controllers/orders.js';

router.get('/', checkAuth, orders_get_all);

router.post('/', checkAuth, create_order);

router.get('/:orderId', checkAuth, orders_get_order);

router.delete('/:orderId', checkAuth, orders_delete_order);

export default router;
