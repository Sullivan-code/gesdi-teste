'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Lock, X } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  coverImage: string;
  fileUrl: string;
  linkType: 'BUY' | 'READ' | 'EXTERNAL';
  externalLink: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | null;
}

const Biblioteca: React.FC = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    linkType: 'BUY' as 'BUY' | 'READ' | 'EXTERNAL',
    externalLink: '',
    coverImage: null as File | null,
    fileUrl: null as File | null,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/books');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos da API:', data);
      
      let booksArray: Book[] = [];
      
      if (Array.isArray(data)) {
        booksArray = data;
      } else if (data.books && Array.isArray(data.books)) {
        booksArray = data.books;
      } else if (data.data && Array.isArray(data.data)) {
        booksArray = data.data;
      } else if (data.success && Array.isArray(data.data)) {
        booksArray = data.data;
      } else {
        console.error('Formato de dados inesperado:', data);
        setError('Formato de dados inválido. Verifique o console para mais detalhes.');
        setBooks([]);
        return;
      }
      
      if (booksArray.length > 0) {
        const firstBook = booksArray[0];
        if (!firstBook.id || !firstBook.title) {
          console.error('Estrutura de livro inválida:', firstBook);
          setError('Estrutura de dados inválida. Verifique o console.');
          setBooks([]);
          return;
        }
        setBooks(booksArray);
      } else {
        setBooks([]);
      }
      
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar livros');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'jazz1234') {
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      setShowForm(true);
      // Scroll to form
      setTimeout(() => {
        document.getElementById('book-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setPasswordError('Senha incorreta!');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmitBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('linkType', formData.linkType);
      formDataToSend.append('externalLink', formData.externalLink);
      
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      if (formData.fileUrl && formData.linkType === 'READ') {
        formDataToSend.append('fileUrl', formData.fileUrl);
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar livro');
      }

      setFormSuccess('✅ Livro adicionado com sucesso!');
      setFormData({
        title: '',
        author: '',
        description: '',
        linkType: 'BUY',
        externalLink: '',
        coverImage: null,
        fileUrl: null,
      });
      
      // Refresh books list
      await fetchBooks();
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => (input as HTMLInputElement).value = '');
      
    } catch (err) {
      console.error('Erro ao criar livro:', err);
      setFormError(err instanceof Error ? err.message : 'Erro ao criar livro');
    } finally {
      setFormLoading(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError('');
    setFormSuccess('');
    setFormData({
      title: '',
      author: '',
      description: '',
      linkType: 'BUY',
      externalLink: '',
      coverImage: null,
      fileUrl: null,
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-purple-700 text-xl">📚 Carregando livros...</div>
        <div className="text-gray-500 text-sm mt-2">Aguarde um momento</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-red-500 text-2xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar livros</h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchBooks}
          className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 relative">
      {/* Cabeçalho com título e botão + */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900">
          📚 Biblioteca Virtual
        </h1>
        
        {/* Botão de + protegido por senha */}
        <button
          onClick={handleAdminAccess}
          className="bg-purple-700 hover:bg-purple-800 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center"
          title="Administrar Livros"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Formulário para adicionar livro */}
      {showForm && (
        <div id="book-form" className="mb-10 bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200 relative">
          <button
            onClick={closeForm}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-bold text-purple-800 mb-4">📖 Adicionar Novo Livro</h2>
          
          {formSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {formSuccess}
            </div>
          )}
          
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              ❌ {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmitBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Livro *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Digite o título"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor(a) *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Digite o nome do autor"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Breve descrição do livro"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Link *
                </label>
                <select
                  name="linkType"
                  value={formData.linkType}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="BUY">💰 Comprar</option>
                  <option value="READ">📖 Ler</option>
                  <option value="EXTERNAL">🔗 Externo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Externo
                </label>
                <input
                  type="url"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="URL para compra ou acesso"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capa do Livro
                </label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WebP</p>
              </div>
              
              {formData.linkType === 'READ' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arquivo PDF
                  </label>
                  <input
                    type="file"
                    name="fileUrl"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Apenas arquivos PDF</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition duration-200 disabled:opacity-50"
              >
                {formLoading ? 'Adicionando...' : '📚 Adicionar Livro'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Grid de Livros */}
      {books.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Nenhum livro disponível no momento.</p>
          <p className="text-gray-400 mt-2">Volte em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              {/* Imagem */}
              <div className="relative h-64 bg-gray-100">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Erro na imagem:', book.coverImage);
                      (e.target as HTMLImageElement).src = '/images/default-cover.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-semibold">Autor(a):</span> {book.author}
                </p>
                {book.description && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {book.description}
                  </p>
                )}
                
                {/* Botão de ação */}
                {book.linkType === 'READ' && book.fileUrl && (
                  <a
                    href={book.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    📖 Ler Agora
                  </a>
                )}
                {book.linkType === 'BUY' && book.externalLink && (
                  <a
                    href={book.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition duration-200 bg-green-600 hover:bg-green-700 text-white"
                  >
                    💰 Comprar
                  </a>
                )}
                {book.linkType === 'EXTERNAL' && book.externalLink && (
                  <a
                    href={book.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition duration-200 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    🔗 Acessar
                  </a>
                )}
                {(!book.fileUrl && !book.externalLink) && (
                  <span className="inline-block w-full text-center px-4 py-2 rounded-lg font-semibold bg-gray-400 text-white cursor-not-allowed">
                    Indisponível
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all animate-slideIn">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-purple-700" />
                </div>
                <h2 className="text-2xl font-bold text-purple-900">🔒 Acesso Restrito</h2>
                <p className="text-gray-600 mt-2">
                  Digite a senha para adicionar um novo livro
                </p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha de Administrador
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Digite a senha"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span>❌</span> {passwordError}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Estilos CSS para animações */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Biblioteca;