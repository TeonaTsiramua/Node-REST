import express from 'express';
import multer from 'multer';
import checkAuth from '../middleware/check-auth.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

import { products_get_all } from '../controllers/products.js';
import { products_create_product } from '../controllers/products.js';
import { products_change_product } from '../controllers/products.js';
import { products_get_product } from '../controllers/products.js';
import { products_delete_product } from '../controllers/products.js';

router.get('/', products_get_all);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  products_create_product
);

router.get('/:productId', products_get_product);

router.patch('/:productId', products_change_product);

router.delete('/:productId', checkAuth, products_delete_product);

export default router;
