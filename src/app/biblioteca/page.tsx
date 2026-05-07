'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Lock } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  coverImage: string;
  fileUrl: string;
  linkType: 'BUY' | 'READ' | 'EXTERNAL';
  externalLink: string | null;
}

const Biblioteca: React.FC = () => {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setError('Formato de dados inválido');
      }
    } catch (err) {
      setError('Erro ao carregar livros');
      console.error(err);
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
      router.push('/admin/books');
    } else {
      setPasswordError('Senha incorreta!');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
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
      <div className="text-center p-8 text-red-500">{error}</div>
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
                <a
                  href={
                    book.linkType === 'READ' 
                      ? book.fileUrl 
                      : (book.externalLink || '#')
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block w-full text-center px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                    book.linkType === 'BUY' 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : book.linkType === 'READ'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {book.linkType === 'BUY' ? '💰 Comprar' : 
                   book.linkType === 'READ' ? '📖 Ler Agora' : '🔗 Acessar'}
                </a>
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
                  Digite a senha para acessar o painel administrativo
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