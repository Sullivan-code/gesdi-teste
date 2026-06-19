import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UTApi } from 'uploadthing/server';

// Criar instância do UTApi
const utapi = new UTApi();

// POST - Criar um novo livro
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    
    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Título e autor são obrigatórios' },
        { status: 400 }
      );
    }
    
    let coverImageUrl = '';
    const coverImageFile = formData.get('coverImage') as File;
    
    // Upload da capa para o Uploadthing
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const fileBuffer = Buffer.from(await coverImageFile.arrayBuffer());
        
        // Upload usando o UTApi
        const uploadResult = await utapi.uploadFiles(
          new File([fileBuffer], `cover-${Date.now()}-${coverImageFile.name}`, {
            type: coverImageFile.type,
          })
        );
        
        if (uploadResult.data && uploadResult.data.url) {
          coverImageUrl = uploadResult.data.url;
          console.log('✅ Capa enviada para Uploadthing:', coverImageUrl);
        }
      } catch (error) {
        console.error('Erro no upload da capa:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao fazer upload da imagem: ' + (error as Error).message },
          { status: 500 }
        );
      }
    }
    
    let pdfUrl = '';
    const pdfFile = formData.get('fileUrl') as File;
    
    // Upload do PDF para o Uploadthing
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
      try {
        const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
        
        const uploadResult = await utapi.uploadFiles(
          new File([fileBuffer], `pdf-${Date.now()}-${pdfFile.name}`, {
            type: pdfFile.type,
          })
        );
        
        if (uploadResult.data && uploadResult.data.url) {
          pdfUrl = uploadResult.data.url;
          console.log('✅ PDF enviado para Uploadthing:', pdfUrl);
        }
      } catch (error) {
        console.error('Erro no upload do PDF:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao fazer upload do PDF: ' + (error as Error).message },
          { status: 500 }
        );
      }
    }

    // Criar o livro no banco de dados
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description: description || null,
        coverImage: coverImageUrl || '',
        fileUrl: pdfUrl || '',
        linkType: linkType as any || 'BUY',
        externalLink: externalLink || null,
        isActive: true
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Livro adicionado com sucesso!',
      book 
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar livro: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// GET - Buscar todos os livros ativos
export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um livro existente
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do livro é obrigatório' },
        { status: 400 }
      );
    }

    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    const isActive = formData.get('isActive') === 'true';

    let coverImageUrl = existingBook.coverImage;
    const coverImageFile = formData.get('coverImage') as File;
    
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const fileBuffer = Buffer.from(await coverImageFile.arrayBuffer());
        const uploadResult = await utapi.uploadFiles(
          new File([fileBuffer], `cover-${Date.now()}-${coverImageFile.name}`, {
            type: coverImageFile.type,
          })
        );
        
        if (uploadResult.data && uploadResult.data.url) {
          coverImageUrl = uploadResult.data.url;
        }
      } catch (error) {
        console.error('Erro no upload da capa:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao fazer upload da imagem' },
          { status: 500 }
        );
      }
    }

    let pdfUrl = existingBook.fileUrl;
    const pdfFile = formData.get('fileUrl') as File;
    
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
      try {
        const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
        const uploadResult = await utapi.uploadFiles(
          new File([fileBuffer], `pdf-${Date.now()}-${pdfFile.name}`, {
            type: pdfFile.type,
          })
        );
        
        if (uploadResult.data && uploadResult.data.url) {
          pdfUrl = uploadResult.data.url;
        }
      } catch (error) {
        console.error('Erro no upload do PDF:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao fazer upload do PDF' },
          { status: 500 }
        );
      }
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: title || existingBook.title,
        author: author || existingBook.author,
        description: description !== undefined ? description : existingBook.description,
        coverImage: coverImageUrl,
        fileUrl: pdfUrl,
        linkType: linkType as any || existingBook.linkType,
        externalLink: externalLink !== undefined ? externalLink : existingBook.externalLink,
        isActive: isActive !== undefined ? isActive : existingBook.isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Livro atualizado com sucesso!',
      book 
    });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar livro: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Deletar um livro (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do livro é obrigatório' },
        { status: 400 }
      );
    }

    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    await prisma.book.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Livro deletado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar livro: ' + (error as Error).message },
      { status: 500 }
    );
  }
}