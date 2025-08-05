"use client";

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const livros = [
  {
    id: 1,
    titulo: "Entrelaçando Pesquisas: História das Mulheres, Gêneros e Sexualidades",
    autor: "Autorxs/Organizadorxs: Denize Sepulveda e Renan Corrêa",
    descricao:
      "Uma análise entrelaçada sobre temas sociais contemporâneos. O conteúdo aborda perspectivas múltiplas com enfoque crítico e interdisciplinar.",
    capa: "/images/capas/1.jpg",
    link: "/ebooks/Ebook-Entrelacando-Pesquisas-Historias-de-Mulheres-Generos-e-Sexualidades.pdf",
    botaoTexto: "Ler Livro",
  },
  {
    id: 2,
    titulo: "Gêneros, Sexualidades e Educação na Ordem do Discurso",
    autor: "Autorxs/Organizadorxs: Denize Sepulveda e Ivan Amaro",
    descricao:
      "Uma reflexão sobre a construção dos discursos que atravessam os campos da sexualidade, gênero e educação. Essencial para debates acadêmicos e sociais. O livro oferece uma análise profunda das dinâmicas discursivas presentes nas práticas educacionais e sociais, destacando como o discurso molda compreensões sobre identidade, diversidade e inclusão. Com embasamento teórico sólido, os autores promovem um debate crítico, necessário para transformar espaços pedagógicos em ambientes mais acolhedores e conscientes.",
    capa: "/images/capas/generos.jpg",
    link: "https://www.editoracrv.com.br/produtos/detalhes/33503-generos-sexualidades-e-educacao-na-ordem-do-dia",
    botaoTexto: "Comprar Livro",
  },
  {
    id: 3,
    titulo: "Emancipação social e exclusão no cotidiano escolar: A homofobia e sua influência nas tessituras identitárias",
    autor: "Autora: Denize Sepulveda",
    descricao:
      "Discussões sobre a busca por justiça social e caminhos de transformação social a partir de uma ótica crítica. Ideal para estudos em ciências sociais.",
    capa: "/images/capas/emacipa.jpg",
    link: "https://www.instagram.com/gesdiuerj/?igsh=MWx2N3lram1qZG42OA%3D%3D#",
    botaoTexto: "Comprar Livro",
  },
];

const textos = [
  {
    titulo: "QUESTÕES DE GÊNEROS NO ESPORTE ESCOLAR",
    autor: "Gabriel Magalhães Rodrigues Coelho",
    link: "https://www.bdtd.uerj.br:8443/handle/1/23783",
    lattes: "http://lattes.cnpq.br/2839092604126253",
  },
  {
    titulo: "Orelhões emoldurados: A expulsão escolar de mulheres trans e travestis na cidade do Rio de Janeiro",
    autor: "Fábio Pinheiro Ramos de Souza",
    link: "https://ppgedu.org/wp-content/uploads/2024/08/2019-Fabio-Pinheiro.pdf",
    lattes: "http://lattes.cnpq.br/9844171318236692",
  },
  {
    titulo: "Vozes para um protagonismo feminino",
    autor: "Euridice Hespanhol Macedo Pessoa",
    link: "https://www.bdtd.uerj.br:8443/handle/1/19034",
    lattes: "http://lattes.cnpq.br/4650510230480031",
  },
  {
    titulo: "Gêneros e Sexualidades nos cursos de Geografia e de Pedagogia",
    autor: "Renan Corrêa dos Santos",
    link: "https://www.bdtd.uerj.br:8443/handle/1/22882",
    lattes: "http://lattes.cnpq.br/6024484066696308",
  },
  {
    titulo: "Gêneros e Sexualidades no Plano Municipal de Educação de São Gonçalo",
    autor: "Maíra Martins da Silva",
    link: "https://www.bdtd.uerj.br:8443/bitstream/1/19139/4/Disserta%C3%A7%C3%A3o%20-%20Ma%C3%ADra%20Marins%20-%202020%20-%20completa.pdf",
    lattes: "http://lattes.cnpq.br/6978951156027813",
  },
  {
    titulo: "A visibilidade LGBTI+ e o protagonismo lésbico",
    autor: "Melina Aurora Terra Fereira",
    link: "https://www.bdtd.uerj.br:8443/handle/1/19208",
    lattes: "http://lattes.cnpq.br/4018634421374364",
  },
  {
    titulo: "TRANSGÊNERXS E TRAVESTIS NOS PRESÍDIOS FEMININOS DO RIO DE JANEIRO",
    autor: "Penélope Cavalcanti",
    link: "https://www.bdtd.uerj.br:8443/handle/1/20043",
    lattes: "http://lattes.cnpq.br/1549989180611934",
  },
  {
    titulo: "O corfebol e a equidade entre os gêneros na Escola",
    autor: "Juan Leal Garcia",
    link: "https://www.bdtd.uerj.br:8443/handle/1/19270",
    lattes: "http://lattes.cnpq.br/6580433082414756",
  },
  {
    titulo: "Transicionando a educação: o Preparem Niterói como agente transformador da sala de aula",
    autor: "Ana Carolina Lydia Ferreira da Silva",
    link: "https://www.bdtd.uerj.br:8443/bitstream/1/21900/2/Disserta%C3%A7%C3%A3o%20-%20Ana%20Carolina%20Lydia%20Ferreira%20da%20Silva%20-%202023%20-%20Completo.pdf",
    lattes: "http://lattes.cnpq.br/2669505554815496",
  },
  {
    titulo: "Práticas lúdicas educativas com o cotidiano da Escola Municipal Pastor Ricardo Parise",
    autor: "Joana Nély Marques Bispo",
    link: "https://www.bdtd.uerj.br:8443/handle/1/9897",
    lattes: "http://lattes.cnpq.br/6936804170054508",
  },
  {
    titulo: "Livros Didáticos de História Como Lugar de Memoria",
    autor: "Fábio da Silva Gomes",
    link: "https://rima.ufrrj.br/jspui/handle/20.500.14407/13853",
    lattes: null,
  },
  {
    titulo: "O INSTITUTO PROFISSIONAL FEMININO ORSINA DA FONSECA",
    autor: "Teresa Vitória Fernandes Alves",
    link: "https://www.bdtd.uerj.br:8443/handle/1/23702",
    lattes: "http://lattes.cnpq.br/2217655483474385",
  },
];

const Biblioteca: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center text-purple-700 drop-shadow-lg">
        <span className="text-purple-900">Biblioteca Virtual📚</span>
      </h1>

      {/* LIVROS */}
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
            <p className="text-gray-800 dark:text-gray-300 mb-3 font-medium">{livro.autor}</p>
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

      {/* TEXTOS DISPONÍVEIS NA INTERNET */}
      <h2 className="text-2xl md:text-4xl font-bold mt-20 mb-6 text-purple-800 text-center">
        Textos Disponíveis na Internet
      </h2>
      <div className="space-y-6">
        {textos.map((texto, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md"
          >
            <h3 className="text-xl font-semibold text-purple-900 mb-2">{texto.titulo}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Autor(a): {texto.autor}</p>
            <a
              href={texto.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
            >
              Acessar Texto
            </a>
            {texto.lattes && (
              <a
                href={texto.lattes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Currículo Lattes
              </a>
            )}
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
