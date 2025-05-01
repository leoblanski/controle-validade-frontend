import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";
import api from "../api";
import Input from "../components/Input";
import DataTable from "../components/DataTable";
import Layout from "../components/Layout";

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
      setErrorMessage(
        "Erro de conexão. Verifique sua internet ou tente mais tarde."
      );
      return;
    }

    const statusMessages = {
      404: "Produto não encontrado.",
      500: "Erro no servidor. Tente novamente mais tarde.",
    };

    setErrorMessage(
      statusMessages[error.response.status] ||
        "Erro ao processar a solicitação."
    );
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
        const response = await api.put(
          `http://localhost/api/categories/${categoryId}`,
          newCategory
        );
        setCategories(
          categories.map((category) =>
            category.id === categoryId ? response.data : category
          )
        );
        setEditCategory(false);
        setCategoryId(null);
      } else {
        const response = await api.post(
          "http://localhost/api/categories",
          newCategory
        );
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
    <main className="relative min-h-screen p-4 sm:p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <Layout
          setEditCategory={setEditCategory}
          setNewCategory={setNewCategory}
          setIsModalOpen={setIsModalOpen}
          faMagnifyingGlass={faMagnifyingGlass}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          navigate={navigate}
          pageTitle="Categorias"
          backButton={"Voltar ao menu"}
          addButton={"Adicionar Categoria"}
          nextPage={"Próxima"}
          backPage={"Anterior"}

        >
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
                <h2 className="text-xl font-semibold mb-4">
                  {editCategory
                    ? "Edição de Categorias"
                    : "Cadastro de Categorias"}
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
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
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
                    <button
                      type="button"
                      id="button-m"
                      onClick={() => setIsModalOpen(false)}
                    >
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
            <DataTable
              columns={columns}
              data={currentItems}
              loading={loading}
              onEdit={(category) => handleEdit(category.id)}
            />
          </div>
        </Layout>
      </div>
    </main>
  );
}

export default Categories;
