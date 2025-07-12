// import React from 'react'
// import ProductCard from './Components/ProductCard'

// function App() {
//   return (
//     <div>
//       <ProductCard/>
//     </div>
//   )
// }

// export default App


// src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './Components/ProductCard'

const App = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setDisplayedProducts(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering & Searching
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (search.trim() !== '') {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setDisplayedProducts(filtered);
    setCurrentPage(1); // Reset to page 1 after filter
  }, [search, selectedCategory, products]);

  // Pagination Logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = displayedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="container">
      <h1> Product Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="status-msg">Loading products...</p>
      ) : error ? (
        <p className="status-msg error">{error}</p>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="status-msg">No products found.</p>
            )}
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;