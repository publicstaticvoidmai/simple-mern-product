import React, { useState, useEffect } from 'react';

import Header from './components/Header/Header';
import NewProduct from './components/Products/NewProduct';
import ProductList from './components/Products/ProductList';
import './App.css';

function App() {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // when the app launches - code
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      // default is GET
      const response = await fetch('http://localhost:5000/products');

      // extract response
      const responseData = await response.json();

      // set loadProducts to extracted responseData from be 
      setLoadedProducts(responseData.products);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const addProductHandler = async (productName, productPrice) => {
    try {
      const newProduct = {
        title: productName,
        price: +productPrice // "+" to convert string to number
      };
      let hasError = false;
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST', //override default to POST
        body: JSON.stringify(newProduct),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        hasError = true;
      }

      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      // update products to rerender ui
      setLoadedProducts(prevProducts => {
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id
        });
      });
    } catch (error) {
      alert(error.message || 'Something went wrong!');
    }
  };

  return (
    <React.Fragment>
      <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && <ProductList items={loadedProducts} />}
      </main>
    </React.Fragment>
  );
}

export default App;
