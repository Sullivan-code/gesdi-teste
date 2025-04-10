"use client";

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const livros = [
  {
    id: 1,
    titulo: "Entrelaçando Pesquisas: História das Mulheres, Gêneros e Sexualidades",
    autor: "Denize Sepulveda e Renan Corrêa",
    descricao:
      "Uma análise entrelaçada sobre temas sociais contemporâneos. O conteúdo aborda perspectivas múltiplas com enfoque crítico e interdisciplinar.",
    capa: "/images/capas/1.jpg",
    link: "/ebooks/Ebook-Entrelacando-Pesquisas-Historias-de-Mulheres-Generos-e-Sexualidades.pdf",
    botaoTexto: "Ler Livro",
  },
  {
    id: 2,
    titulo: "Gêneros, Sexualidades e Educação na Ordem do Discurso",
    autor: "Denize Sepulveda e Ivan Amaro",
    descricao:
      "Uma reflexão sobre a construção dos discursos que atravessam os campos da sexualidade, gênero e educação. Essencial para debates acadêmicos e sociais. O livro oferece uma análise profunda das dinâmicas discursivas presentes nas práticas educacionais e sociais, destacando como o discurso molda compreensões sobre identidade, diversidade e inclusão. Com embasamento teórico sólido, os autores promovem um debate crítico, necessário para transformar espaços pedagógicos em ambientes mais acolhedores e conscientes.",
    capa: "/images/capas/generos.jpg",
    link: "https://www.editoracrv.com.br/produtos/detalhes/33503-generos-sexualidades-e-educacao-na-ordem-do-dia",
    botaoTexto: "Comprar Livro",
  },
  {
    id: 3,
    titulo: "Emancipação social e exclusão no cotidiano escolar: A homofobia e sua influência nas tessituras identitárias",
    autor: "Denize Sepulveda",
    descricao:
      "Discussões sobre a busca por justiça social e caminhos de transformação social a partir de uma ótica crítica. Ideal para estudos em ciências sociais.",
    capa: "/images/capas/emacipa.jpg",
    link: "https://www.editoracrv.com.br/produtos/detalhes/38850-emancipacao-social-e-exclusao-no-cotidiano-escolar-bra-homofobia-e-sua-influencia-nas-tessituras-identitarias",
    botaoTexto: "Comprar Livro",
  },
];

const Biblioteca: React.FC = () => {
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
              className={`w-full h-72 object-cover rounded-t-lg ${livro.id === 1 ? 'object-right' : 'object-center'}`}
            />

            <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
              {livro.titulo}
            </h2>

            <p className="text-gray-800 dark:text-gray-300 mb-3 font-medium">
              Autora: {livro.autor}
            </p>

            {livro.descricao && (
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-grow max-h-32 overflow-hidden border border-gray-300 dark:border-gray-600 mb-4">
                <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-4">
                  {livro.descricao}
                </p>
              </div>
            )}

            <a
              href={livro.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-200"
            >
              {livro.botaoTexto}
            </a>
          </div>
        ))}
      </div>

      {/* Botão do WhatsApp */}
      <div className="flex justify-center mt-16">
        <a
          href="https://wa.me/5521972883178"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-xl transition-all duration-300 shadow-lg hover:scale-105"
        >
          <FaWhatsapp size={24} />
          <span>Compre o seu livro</span>
        </a>
      </div>
    </div>
  );
};

export default Biblioteca;
