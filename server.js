const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storeName = process.env.STORE_NAME;
const adminToken = process.env.ADMIN_TOKEN;

app.get('/products', async (_, res) => {
  try {
    const response = await axios.get(
      `https://${storeName}.myshopify.com/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data.products);
  } catch (error) {
    res.status(500).send('Failed to fetch products');
  }
});

app.post('/update-product', async (req, res) => {
  const { id, title, price } = req.body;

  try {
    const response = await axios.put(
      `https://${storeName}.myshopify.com/admin/api/2024-01/products/${id}.json`,
      {
        product: {
          id,
          title,
          variants: [{ price }],
        },
      },
      {
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data.product);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).send('Failed to update product');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
