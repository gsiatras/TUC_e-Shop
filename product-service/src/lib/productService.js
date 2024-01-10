import { Product } from '../models/Product.js';

async function handleProducts(order) {
  const products = order.products;

  try {
    // Fetch each product from the database and check if the quantity is sufficient
    for (const productInfo of products) {
      const productId = productInfo.id;
      const requiredQuantity = productInfo.quantity;

      const product = await Product.findById(productId);

      if (!product || product.quantity < requiredQuantity) {
        // Product not found or quantity is insufficient
        return false;
      }
    }

    // All products have sufficient quantity
    return true;
  } catch (error) {
    // Handle any errors that might occur during the database query
    console.error('Error handling products:', error.message);
    return false;
  }
}

export { handleProducts };
