import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DataTable from '../components/DataTable';
import api from '../api';

import '../App.css';


function Products() {

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    manufacturing_date: '',
    expiration_date: '',
    category_id: '',
    quantity: 1
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [IsEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = 'http://localhost/api/products';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleApiError = (error) => { 
    if(!error.response) {
      setErrorMessage('Erro de conexão. Verifique sua internet ou tente mais tarde.');
      return;
    }

    const statusMessages = {
      404: 'Produto não encontrado.',
      500: 'Erro no servidor. Tente novamente mais tarde.',
    };

    setErrorMessage(statusMessages[error.response.status] || 'Erro ao processar a solicitação.');
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://localhost/api/categories');
      setCategories(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('http://localhost/api/products');
      setProducts(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      manufacturing_date: '',
      expiration_date: '',
      category_id: '',
      quantity: 1
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const formatInputDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      manufacturing_date: formatInputDate(product.manufacturing_date),
      expiration_date: formatInputDate(product.expiration_date),
      category_id: product.category_id,
      quantity: product.quantity
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    if (new Date(formData.expiration_date) < new Date(formData.manufacturing_date)) {
      alert('A data de validade não pode ser menor que a data de fabricação.');
      return;
    }

    try {
      if (formData.id) {
        await api.put(`${apiUrl}/${formData.id}`, formData);
      } else {
        await api.post(apiUrl, formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este produto?')) return;

    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchProducts();
    } catch (error) {
      handleApiError(error);  
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-200 -z-10" />

      <main className="relative min-h-screen p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto p-6 sm:p-8">
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-between mb-4">
            <button onClick={() => navigate('/')}
              id='button-b'
              >
                Voltar ao Menu
            </button>
            <h2 className="text-xl font-semibold mb-4">Listagem de Produtos</h2>
            <button onClick={openAddModal} id="button-b">
              Adicionar Produto
            </button>
          </div>

          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Buscar"
              className="border rounded-lg px-3 py-2 w-64 shadow-sm focus:ring focus:ring-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DataTable

            columns={[
              { key: 
                'index', 
                header: 'ID',
                render: (_row, index) => index +1,
              },
              { key: 'name', header: 'Nome' },
              { key: 'description', header: 'Descrição' },
              { key: 'manufacturing_date', header: 'Fabricação' },
              { key: 'expiration_date', header: 'Validade' },
              { key: 'quantity', header: 'Quantidade' },
              { 
                key: 'category.name', 
                header: 'Categoria',
                render: (row) => row.category?.name || 'Sem Categoria'
              },
            ]}
            data= {filteredProducts}	
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
            


          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto relative">
                <h3 className="text-lg mb-4">{IsEditMode ? 'Editar Produto' : 'Adicionar Produto'}</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome do Produto"
                    value={formData.name}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    required
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                  />
                  <input
                    type="date"
                    name="manufacturing_date"
                    value={formData.manufacturing_date}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    required
                    />
                  <input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    placeholder="Quantidade"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    required
                  />
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="border rounded-lg px-3 py-2 w-full mb-2"
                    required
                  >
                    <option value="">Selecione uma Categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
                    <button type="submit" id="button-b" disabled={isSubmitting}>
                      {IsEditMode ? 'Salvar' : 'Cadastrar'}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} id="button-m">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Products;