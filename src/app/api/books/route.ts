import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 👈 USANDO O PRISMA DO LIB
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

// POST - Criar um novo livro
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    
    // Validar campos obrigatórios
    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Título e autor são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Upload da capa
    const coverImageFile = formData.get('coverImage') as File;
    let coverImageUrl = '';
    
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const coverBytes = await coverImageFile.arrayBuffer();
        const coverBuffer = Buffer.from(coverBytes);
        
        const timestamp = Date.now();
        const cleanFileName = coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const coverFileName = `cover-${timestamp}-${cleanFileName}`;
        const coverPath = path.join(process.cwd(), 'public/uploads/covers', coverFileName);
        
        const coverDir = path.join(process.cwd(), 'public/uploads/covers');
        if (!existsSync(coverDir)) {
          await mkdir(coverDir, { recursive: true });
        }
        
        await writeFile(coverPath, coverBuffer);
        coverImageUrl = `/uploads/covers/${coverFileName}`;
      } catch (error) {
        console.error('Erro ao salvar capa:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao salvar a imagem da capa' },
          { status: 500 }
        );
      }
    }
    
    // Upload do PDF (apenas se linkType for READ)
    const pdfFile = formData.get('fileUrl') as File;
    let pdfUrl = '';
    
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
      try {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfBytes);
        
        const timestamp = Date.now();
        const cleanFileName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pdfFileName = `pdf-${timestamp}-${cleanFileName}`;
        const pdfPath = path.join(process.cwd(), 'public/uploads/pdfs', pdfFileName);
        
        const pdfDir = path.join(process.cwd(), 'public/uploads/pdfs');
        if (!existsSync(pdfDir)) {
          await mkdir(pdfDir, { recursive: true });
        }
        
        await writeFile(pdfPath, pdfBuffer);
        pdfUrl = `/uploads/pdfs/${pdfFileName}`;
      } catch (error) {
        console.error('Erro ao salvar PDF:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao salvar o arquivo PDF' },
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
        coverImage: coverImageUrl || '/images/default-cover.jpg',
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

    // Verificar se o livro existe
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

    // Upload da capa (se um novo arquivo for fornecido)
    const coverImageFile = formData.get('coverImage') as File;
    let coverImageUrl = existingBook.coverImage;
    
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const coverBytes = await coverImageFile.arrayBuffer();
        const coverBuffer = Buffer.from(coverBytes);
        
        const timestamp = Date.now();
        const cleanFileName = coverImageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const coverFileName = `cover-${timestamp}-${cleanFileName}`;
        const coverPath = path.join(process.cwd(), 'public/uploads/covers', coverFileName);
        
        const coverDir = path.join(process.cwd(), 'public/uploads/covers');
        if (!existsSync(coverDir)) {
          await mkdir(coverDir, { recursive: true });
        }
        
        await writeFile(coverPath, coverBuffer);
        coverImageUrl = `/uploads/covers/${coverFileName}`;
      } catch (error) {
        console.error('Erro ao salvar capa:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao salvar a imagem da capa' },
          { status: 500 }
        );
      }
    }

    // Upload do PDF (se um novo arquivo for fornecido)
    const pdfFile = formData.get('fileUrl') as File;
    let pdfUrl = existingBook.fileUrl;
    
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
      try {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfBytes);
        
        const timestamp = Date.now();
        const cleanFileName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const pdfFileName = `pdf-${timestamp}-${cleanFileName}`;
        const pdfPath = path.join(process.cwd(), 'public/uploads/pdfs', pdfFileName);
        
        const pdfDir = path.join(process.cwd(), 'public/uploads/pdfs');
        if (!existsSync(pdfDir)) {
          await mkdir(pdfDir, { recursive: true });
        }
        
        await writeFile(pdfPath, pdfBuffer);
        pdfUrl = `/uploads/pdfs/${pdfFileName}`;
      } catch (error) {
        console.error('Erro ao salvar PDF:', error);
        return NextResponse.json(
          { success: false, error: 'Erro ao salvar o arquivo PDF' },
          { status: 500 }
        );
      }
    }

    // Atualizar o livro
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

    // Verificar se o livro existe
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    // Soft delete (apenas desativar)
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