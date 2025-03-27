"use client"

import { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function useAutoResizeTextArea(value: string) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return textAreaRef;
}

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  capa: string;
  pdf: string;
  descricao?: string;
  coverHeight?: number;
}

export default function Biblioteca() {
  const [user] = useState({ id: 'user_2uRrfGACqq0B1TRie8nNbj1iXsy' });
  const isAdmin = user.id === 'user_2uRrfGACqq0B1TRie8nNbj1iXsy';
  const [senhaCorreta, setSenhaCorreta] = useState(false);

  const [livros, setLivros] = useState<Livro[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [livroEditando, setLivroEditando] = useState<Livro | null>(null);
  const [capaPreview, setCapaPreview] = useState<string | null>(null);
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [senha, setSenha] = useState('');
  const [coverHeight, setCoverHeight] = useState(64);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [showCropControls, setShowCropControls] = useState(false);
  const [fileName, setFileName] = useState('');

  const SENHA_CORRETA = 'byericsullivan';
  const descricaoRef = useAutoResizeTextArea(livroEditando?.descricao || '');

  useEffect(() => {
    const livrosSalvos = localStorage.getItem('livros');
    if (livrosSalvos) {
      setLivros(JSON.parse(livrosSalvos));
    }
  }, []);

  const salvarLivros = (novosLivros: Livro[]) => {
    setLivros(novosLivros);
    localStorage.setItem('livros', JSON.stringify(novosLivros));
  };

  const adicionarLivro = (livro: Omit<Livro, 'id'>) => {
    const novoLivro = { 
      ...livro, 
      id: Date.now(),
      coverHeight: livro.coverHeight || 64
    };
    salvarLivros([...livros, novoLivro]);
  };

  const editarLivro = (livroAtualizado: Livro) => {
    salvarLivros(livros.map(l => l.id === livroAtualizado.id ? livroAtualizado : l));
  };

  const excluirLivro = (id: number) => {
    salvarLivros(livros.filter(l => l.id !== id));
  };

  const handleCapaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapaPreview(reader.result as string);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setShowCropControls(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = async () => {
    if (!completedCrop || !imgRef) {
      return;
    }

    const croppedImage = await getCroppedImg(imgRef, completedCrop);
    setCapaPreview(croppedImage);
    setShowCropControls(false);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.reject(new Error('Could not get canvas context'));
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const verificarSenha = () => {
    if (senha === SENHA_CORRETA) {
      setSenhaCorreta(true);
      setShowSenhaModal(false);
      abrirNovoLivro();
      setSenha('');
    } else {
      alert('Senha incorreta! Tente novamente.');
    }
  };

  const abrirNovoLivro = () => {
    setLivroEditando(null);
    setCapaPreview(null);
    setFileName('');
    setCoverHeight(64);
    setShowCropControls(false);
    setShowModal(true);
  };

  const abrirEdicaoLivro = (livro: Livro) => {
    setLivroEditando(livro);
    setCapaPreview(livro.capa);
    setFileName('Arquivo selecionado');
    setCoverHeight(livro.coverHeight || 64);
    setShowCropControls(false);
    setShowModal(true);
  };

  return (
    <section className="py-6 dark:bg-gray-100 dark:text-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold text-center text-purple-600 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text drop-shadow-lg mb-12 font-roboto">
          Biblioteca Digital
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {livros.map((livro) => (
            <div 
              key={livro.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative flex flex-col h-full"
            >
              <a
                href={livro.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex flex-col h-full"
              >
                <div className="flex-shrink-0">
                  <img
                    src={livro.capa}
                    alt={`Capa do livro ${livro.titulo}`}
                    className={`w-full h-${livro.coverHeight || 64} object-cover`}
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 dark:text-white line-clamp-2">
                    {livro.titulo}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">Autor: {livro.autor}</p>
                  {livro.descricao && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg flex-grow max-h-32 overflow-hidden">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                        {livro.descricao}
                      </p>
                    </div>
                  )}
                </div>
              </a>

              {isAdmin && senhaCorreta && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      abrirEdicaoLivro(livro);
                    }}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      excluirLivro(livro.id);
                    }}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowSenhaModal(true)}
              className="bg-purple-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              + 
            </button>
          </div>
        )}

        {showSenhaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Digite a Senha</h2>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowSenhaModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={verificarSenha}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {livroEditando ? 'Editar Livro' : 'Novo Livro'}
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const livro = {
                  titulo: formData.get('titulo') as string,
                  autor: formData.get('autor') as string,
                  capa: capaPreview || '',
                  pdf: formData.get('pdf') as string,
                  descricao: formData.get('descricao') as string,
                  coverHeight: coverHeight
                };

                if (livroEditando) {
                  editarLivro({ ...livro, id: livroEditando.id });
                } else {
                  adicionarLivro(livro);
                }

                setShowModal(false);
                setCapaPreview(null);
              }}>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block mb-2">Título:</label>
                    <input
                      type="text"
                      name="titulo"
                      defaultValue={livroEditando?.titulo}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Autor:</label>
                    <input
                      type="text"
                      name="autor"
                      defaultValue={livroEditando?.autor}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Descrição:</label>
                    <textarea
                      ref={descricaoRef}
                      name="descricao"
                      defaultValue={livroEditando?.descricao}
                      onChange={(e) => {
                        if (descricaoRef.current) {
                          descricaoRef.current.style.height = "auto";
                          descricaoRef.current.style.height = `${descricaoRef.current.scrollHeight}px`;
                        }
                      }}
                      className="w-full p-2 border rounded resize-none overflow-hidden"
                      rows={1}
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Capa do Livro:</label>
                    <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Escolher arquivo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCapaUpload} 
                        className="hidden" 
                      />
                      <span className="mt-1 text-sm text-gray-500">
                        {fileName || 'Nenhum arquivo escolhido'}
                      </span>
                    </label>
                    {capaPreview && showCropControls && (
                      <div className="mt-4">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                        >
                          <img
                            ref={setImgRef}
                            src={capaPreview}
                            alt="Pré-visualização da capa"
                            className="max-w-full max-h-64"
                          />
                        </ReactCrop>
                        <button
                          type="button"
                          onClick={applyCrop}
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Aplicar Corte
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCropControls(false)}
                          className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                    {capaPreview && !showCropControls && (
                      <div className="mt-4">
                        <img
                          src={capaPreview}
                          alt="Pré-visualização da capa"
                          className={`w-full h-${coverHeight} object-cover mb-4`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCropControls(true)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Ajustar Corte
                        </button>
                        <div>
                          <label className="block mb-2 mt-4">Altura da Capa: {coverHeight}px</label>
                          <input
                            type="range"
                            min="32"
                            max="96"
                            step="8"
                            value={coverHeight}
                            onChange={(e) => setCoverHeight(Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Pequeno</span>
                            <span>Médio</span>
                            <span>Grande</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">URL do PDF:</label>
                    <input
                      type="url"
                      name="pdf"
                      defaultValue={livroEditando?.pdf}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setCapaPreview(null);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}