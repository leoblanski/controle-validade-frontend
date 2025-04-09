import { Link } from "react-router-dom";
import { FaBox, FaTags } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Controle de Validade</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
          <Link
            to="/products"
            className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition"
          >
            <FaBox className="text-blue-500 text-4xl" />
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-800">Produtos</h2>
              <p className="text-gray-500 text-sm">Gerencie seus produtos com facilidade</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition"
          >
            <FaTags className="text-green-500 text-4xl" />
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
              <p className="text-gray-500 text-sm">Organize seus produtos por categoria</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;