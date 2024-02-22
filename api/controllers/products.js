import mongoose from 'mongoose';
import Product from '../models/product.js';

export const products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

export const products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Created product Successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          url: 'http://localhost:3000/products/' + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

export const products_get_product = (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/',
          },
        });
      } else {
        res.status(404).json({
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export const products_change_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product updated',
        result: result,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

export const products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        message: 'Product deleted',
        product: result,
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/',
          body: {
            name: 'String',
            price: 'Number',
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
