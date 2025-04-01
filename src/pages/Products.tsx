import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

function Products() {
  interface Product {
    id: number;
    name: string;
  }
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.length &&
          products.map((product) => <li key={product.id}>{product.name}</li>)}
      </ul>
    </div>
  );
}

export default Products;
