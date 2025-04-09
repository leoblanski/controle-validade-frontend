import React, { FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState([
    {
      name: "",
      description: "",
      status: true,
    },
  ]);
  const [error, setError] = useState({ name: "" });
  const [formSubmit, setFormSubmit] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState("");
  const itemsPage = 10;

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

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.log("erro");
    } ""
  };

  const handleEdit = async (id) => {
    setEditCategory(true);
    setCategoryId(id);

    try {
      const response = await axios.get(`http://localhost/api/categories/${id}`);
      const category = response.data;
      setNewCategory({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } catch (error) {
      console.log("erro");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmit(true);

    setNewCategory({ name: "", description: "", status: true });

    let nameError = "";

    if (!newCategory.name)
      nameError = "Por favor, informe o nome da categoria.";

    setError({ name: nameError });

    if (!newCategory.name.trim()) return;

    try {
      if (editCategory && categoryId !== null) {
        const response = await axios.put(
          `http://localhost/api/categories/${categoryId}`,
          {
            name: newCategory.name,
            description: newCategory.description,
            status: newCategory.status,
          }
        );

        setCategories(
          categories.map((category) =>
            category.id === categoryId ? response.data : category
          )
        );

        setEditCategory(false);
        setCategoryId(null);
      } else {
        const response = await axios.post("http://localhost/api/categories", {
          name: newCategory.name,
          description: newCategory.description,
          status: newCategory.status,
        });

        setCategories([...categories, response.data]);
      }

      setNewCategory({ name: "", description: "", status: true });
    } catch (error) {
      console.error("Erro ao adicionar ou editar categoria");
    }
  };

  const handleRadioChange = () => {
    setNewCategory((prevState) => ({
      ...prevState,
      status: !prevState.status,
    }));
  };

  return (
    <main className=" flex flex-col items-center justify-center space-y-8">
      <div className="bg-[#ffffff] mt-8 py-5 px-6 min-w-[1000px] space-y-2">
        <h2 className="text-xl">
          {editCategory ? "Edição de Categorias" : "Cadastro de Categorias"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-4 justify-between ">
            <div className="flex flex-col w-full">
              <label htmlFor="">
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={newCategory.name}
                autoFocus
                className="border rounded-lg cursor-pointer p-1"
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="">Descrição</label>
              <input
                type="text"
                name="description"
                id="description"
                value={newCategory.description}
                className="border rounded-lg p-1"
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            {formSubmit && error.name && newCategory.name === "" && (
              <p className="text-xs text-red-600">{error.name}</p>
            )}
          </div>

          <div className="flex gap-1 items-center ">
            <input
              type="checkbox"
              name="status"
              id="active"
              checked={newCategory.status}
              className=" w-4 h-4 border rounded cursor-pointer appearance-none checked:bg-black "
              onChange={handleRadioChange}

            />
            <label htmlFor="active">Ativo</label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="text-white bg-[#EC221F]"
              onClick={(e) =>
                setNewCategory({ ...newCategory, name: "", description: "" })
              }
            >
              Cancelar
            </button>
            <button type="submit" className="text-white bg-[#2C2C2C]">
              {editCategory ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#ffffff] mt-8 py-5 px-6  min-w-[1000px] space-y-2">
        <h2 className="text-xl pb-10">Listagem de Categorias</h2>
        <div className="border rounded-lg">
          <div className="flex justify-end items-center p-2">
            <div className="border rounded p-2 mx-2 ">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="px-4" />
              <input
                type="text"
                placeholder="Buscar"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="px-1 "
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr className=" text-left border-t border-b ">
                <th className="px-4 py-3">ID</th>
                <th className="px-20 py-3">Nome</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="px-4 py-3">{category.id}</td>
                  <td className="px-20 py-3">{category.name}</td>
                  <td className="px-4 py-3">{category.description}</td>
                  <td className="px-16">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="cursor-pointer"
                      onClick={() => handleEdit(category.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot className="text-left">
              <tr>
                <th className="p-3">
                  Mostrando {currentPage} de {totalPages}
                </th>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-end">
            <button
              type="button"
              className="border-none"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"} Anterior
            </button>
            <button
              type="button"
              className="border-none"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima {">"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Categories;
