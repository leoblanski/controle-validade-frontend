import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Layout({
  children,
  setEditCategory,
  setNewCategory,
  setIsModalOpen,
  faMagnifyingGlass,
  searchCategory,
  setSearchCategory,
  setCurrentPage,
  currentPage,
  totalPages,
  navigate,

}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <button onClick={() => navigate("/")} id="button-b">
          Voltar ao Menu
        </button>
        <h2 className="text-xl font-semibold text-center flex-1">
          Listagem de Categorias
        </h2>
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

      <div className="flex justify-end p-4">
        <div className="border rounded-lg flex items-center px-3 py-1 shadow-sm">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="mr-2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Buscar"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="outline-none"
          />
        </div>
      </div>

      <main>{children}</main>

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
  );
}
