
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Categories from "./pages/Categories";
import Products from "./pages/Products";


    const fetchProducts = async () => {
        const res = await axios.get('http://localhost/api/products')
        setProducts(res.data)
    }


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />

        <Route path="/categories" element={<Categories />} />
      </Routes>
    </Router>
  );
}

export default App;
