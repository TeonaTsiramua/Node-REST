import mongoose from 'mongoose';

import Order from '../models/order.js';
import Product from '../models/product.js';

export const orders_get_all = (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

export const create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (product) {
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
        });
        order
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: 'Order stored',
              createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
              },
              request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id,
              },
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      } else {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

export const orders_get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/',
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

export const orders_delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({
    _id: id,
  })
    .exec()
    .then((order) => {
      if (order.deletedCount === 0) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders/',
          body: { productId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
