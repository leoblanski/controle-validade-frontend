import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });
  const [error, setError] = useState({ name: "" });
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.log("erro");
    }
  };

  const handleEdit = async (id: number) => {
    setEditCategory(true);
    setCategoryId(id);

    try {
      const response = await axios.get(`http://localhost/api/categories/${id}`);
      const category = response.data;
      setNewCategory({
        name: category.name,
        description: category.description,
      });
    } catch (error) {
      console.log("errro");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmit(true);

    setNewCategory({ name: "", description: "" });

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
        });

        setCategories([...categories, response.data]);
      }

      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar ou editar categoria");
    }
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
              type="radio"
              name="active"
              id="active"
              className="appearance-none w-4 h-4 border bg-black rounded cursor-pointer"
            />
            <label htmlFor="">Ativo</label>
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
              <input type="text" placeholder="Buscar" className="px-1 " />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr className=" text-left border-t border-b ">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b">
                  <td className="px-4 py-3">{category.id}</td>
                  <td className="px-4 py-3">{category.name}</td>
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
                <th className="p-3">Mostrando 1 de 1</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Categories;
