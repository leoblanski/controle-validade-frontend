
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Categories from "./pages/Categories";
import Products from "./pages/Products";


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
