'use client';

import React, { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  coverImage: string;
  fileUrl: string;
  linkType: 'BUY' | 'READ' | 'EXTERNAL';
  externalLink: string | null;
  isActive: boolean;
}

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    linkType: 'BUY',
    externalLink: '',
    coverImage: null as File | null,
    fileUrl: null as File | null,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/books');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Garantir que data é um array
      if (Array.isArray(data)) {
        setBooks(data);
      } else if (data && Array.isArray(data.books)) {
        setBooks(data.books);
      } else if (data && data.success && Array.isArray(data.data)) {
        setBooks(data.data);
      } else {
        console.error('Resposta inesperada da API:', data);
        setBooks([]);
      }
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      setError('Não foi possível carregar os livros. Verifique se o servidor está rodando.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const uploadFormData = new FormData();
    uploadFormData.append('title', formData.title);
    uploadFormData.append('author', formData.author);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('linkType', formData.linkType);
    uploadFormData.append('externalLink', formData.externalLink);
    uploadFormData.append('createdBy', 'admin');
    
    if (formData.coverImage) {
      uploadFormData.append('coverImage', formData.coverImage);
    }
    
    if (formData.fileUrl && formData.linkType === 'READ') {
      uploadFormData.append('fileUrl', formData.fileUrl);
    }
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('✅ Livro adicionado com sucesso!');
        setShowForm(false);
        setFormData({
          title: '',
          author: '',
          description: '',
          linkType: 'BUY',
          externalLink: '',
          coverImage: null,
          fileUrl: null,
        });
        fetchBooks(); // Recarregar a lista
      } else {
        alert('❌ Erro ao adicionar livro: ' + (result.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao adicionar livro. Verifique o console para mais detalhes.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          alert('✅ Livro deletado com sucesso');
          fetchBooks();
        } else {
          const result = await response.json();
          alert('❌ Erro ao deletar livro: ' + (result.error || 'Erro desconhecido'));
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao deletar livro');
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center p-8">
          <div className="text-purple-700 text-xl">📚 Carregando livros...</div>
          <div className="text-gray-500 mt-2">Aguarde um momento</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">📚 Administração de Livros</h1>
          <p className="text-gray-600 mt-2">Gerencie os livros da sua biblioteca</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
        >
          {showForm ? '❌ Cancelar' : '+ Adicionar Livro'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Formulário de Adicionar Livro */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border-2 border-purple-200">
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Adicionar Novo Livro</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Título do Livro *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Entrelaçando Pesquisas"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Autor(a) *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Ex: Denize Sepulveda"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Descrição do Livro
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Uma breve descrição sobre o livro..."
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Tipo de Link *
              </label>
              <select
                value={formData.linkType}
                onChange={(e) => setFormData({ ...formData, linkType: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
              >
                <option value="BUY">💰 Comprar (Link externo - Mercado Livre, Amazon, etc)</option>
                <option value="READ">📖 Ler (Upload do PDF)</option>
                <option value="EXTERNAL">🔗 Link Externo</option>
              </select>
            </div>
            
            {formData.linkType !== 'READ' && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Link Externo *
                </label>
                <input
                  type="url"
                  required={formData.linkType !== 'READ'}
                  value={formData.externalLink}
                  onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                  placeholder="https://www.amazon.com.br/seu-livro"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cole aqui o link de compra (Mercado Livre, Amazon, etc)
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Imagem da Capa * (JPG, PNG)
              </label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
              />
              <p className="text-sm text-gray-500 mt-1">Selecione uma imagem do seu computador</p>
            </div>
            
            {formData.linkType === 'READ' && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Arquivo PDF do Livro
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">Upload do arquivo PDF para leitura online</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              📚 Salvar Livro
            </button>
          </form>
        </div>
      )}

      {/* Lista de Livros Existentes */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Livros Cadastrados ({books.length})
        </h2>
        {!Array.isArray(books) || books.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">📖 Nenhum livro cadastrado ainda.</p>
            <p className="text-gray-400 mt-2">Clique em "Adicionar Livro" para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={book.coverImage || '/images/default-cover.jpg'}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default-cover.jpg';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    Autor: {book.author}
                  </p>
                  {book.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.linkType === 'BUY' ? 'bg-green-100 text-green-800' :
                      book.linkType === 'READ' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.linkType === 'BUY' ? '💰 Para Compra' :
                       book.linkType === 'READ' ? '📖 Para Leitura' : '🔗 Link Externo'}
                    </span>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;