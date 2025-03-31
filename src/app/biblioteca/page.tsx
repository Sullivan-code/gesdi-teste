import React from 'react';

const livros = [
  {
    id: 1,
    titulo: "Título do Livro 1",
    autor: "Autor 1",
    descricao: "Descrição do livro 1.Descrição do livro 1.Descrição do livro 1.DescriçãDescrição do livro 1.Descrição do livro 1.Descrição do livro 1.Descrição do livro 1.Descrição do livro 1.o do livro 1.Descrição do livro 1.",
    capa: "/images/capas/cover1.jpg",
  },
  {
    id: 2,
    titulo: "Título do Livro 2",
    autor: "Autor 2",
    descricao: "Descrição do livro 2.",
    capa: "/images/capas/cover1.jpg",
  },
  {
    id: 3,
    titulo: "Título do Livro 3",
    autor: "Autor 3",
    descricao: "Descrição do livro 3.",
    capa: "/images/capas/livro3.jpg",
  },
];

const App = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center text-purple-700 drop-shadow-lg">
        <span className="text-purple-900">Biblioteca Virtual📚</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {livros.map((livro) => (
          <div 
            key={livro.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 relative flex flex-col h-full p-6 border border-gray-200 dark:border-gray-700"
          >
            <img
              src={livro.capa}
              alt={`Capa do livro ${livro.titulo}`}
              className="w-full h-72 object-cover rounded-t-lg"
            />
            <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
              {livro.titulo}
            </h2>
            <p className="text-gray-800 dark:text-gray-300 mb-3 font-medium">Autor: {livro.autor}</p>
            {livro.descricao && (
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-grow max-h-32 overflow-hidden border border-gray-300 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-4">
                  {livro.descricao}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;