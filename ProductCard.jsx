import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
    </div>
  );
};

export default ProductCard;