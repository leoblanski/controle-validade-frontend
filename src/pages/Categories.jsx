import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from 'react-spinners';
import api from '../api';
import Input from "../components/Input";
import DataTable from "../components/DataTable";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", status: true });
  const [error, setError] = useState({ name: "" });
  const [formSubmit, setFormSubmit] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const itemsPage = 10;


  const columns = [
    { key: "id", header: "ID", type: "badge" },
    { key: "name", header: "Nome" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPage;
  const endIndex = startIndex + itemsPage;
  const currentItems = filteredCategories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCategories.length / itemsPage);

  const handleApiError = (error) => {
    if (!error.response) {
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
    setLoading(true);
    try {
      const response = await api.get("http://localhost/api/categories");
      setCategories(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setEditCategory(true);
    setCategoryId(id);
    setIsModalOpen(true);

    try {
      const response = await api.get(`http://localhost/api/categories/${id}`);
      const category = response.data;
      setNewCategory({
        name: category.name,
        status: category.status,
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmit(true);

    let nameError = "";
    if (!newCategory.name)
      nameError = "Por favor, informe o nome da categoria.";

    setError({ name: nameError });

    if (!newCategory.name.trim()) return;

    try {
      if (editCategory && categoryId !== null) {
        const response = await api.put(`http://localhost/api/categories/${categoryId}`, newCategory);
        setCategories(categories.map((category) => category.id === categoryId ? response.data : category));
        setEditCategory(false);
        setCategoryId(null);
      } else {
        const response = await api.post("http://localhost/api/categories", newCategory);
        setCategories([...categories, response.data]);
      }
      setNewCategory({ name: "", status: true });
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRadioChange = () => {
    setNewCategory((prevState) => ({
      ...prevState,
      status: !prevState.status,
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-200 -z-10" />

      <main className="relative min-h-screen p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto p-6 sm:p-8 space-y-8">

          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} id='button-b'>Voltar ao Menu</button>
            <h2 className="text-xl font-semibold text-center flex-1">Listagem de Categorias</h2>
            <button
              onClick={() => {
                setEditCategory(false);
                setNewCategory({ name: "", status: true });
                setIsModalOpen(true);
              }}
              id="button-b"
            >
              Adicionar Categoria
            </button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
                <h2 className="text-xl font-semibold mb-4">
                  {editCategory ? "Edição de Categorias" : "Cadastro de Categorias"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      label="Nome"
                      name="category"
                      id="category"
                      type="text"
                      value={newCategory.name}
                      autoFocus
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                  </div>

                  {formSubmit && error.name && newCategory.name === "" && (
                    <p className="text-xs text-red-600">{error.name}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="status"
                      id="active"
                      checked={newCategory.status}
                      className="w-4 h-4 border rounded cursor-pointer appearance-none checked:bg-black"
                      onChange={handleRadioChange}
                    />
                    <label htmlFor="active">Ativo</label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button type="button" id="button-m" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </button>
                    <button type="submit" id="button-b">
                      {editCategory ? "Salvar" : "Cadastrar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="rounded-lg shadow">
            <div className="flex justify-end p-4">
              <div className="border rounded-lg flex items-center px-3 py-1 shadow-sm">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="outline-none"
                />
              </div>
            </div>

            <DataTable
              columns={columns}
              data={currentItems}
              loading={loading}
              onEdit={(category) => handleEdit(category.id)}
            />

            <div className="flex justify-end gap-4 p-4">
              <button
                type="button"
                id="button-b"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {"<"} Anterior
              </button>
              <button
                type="button"
                id="button-b"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima {">"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Categories;
