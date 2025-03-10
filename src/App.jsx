import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        const res = await axios.get('http://rw.local/api/products')
        setProducts(res.data)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <>
            <h1>Products</h1>
            <ul>
                {products.length && products.map((product) => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </>
    )
}


export default App
