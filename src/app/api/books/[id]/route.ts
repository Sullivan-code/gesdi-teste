import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    });
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Livro não encontrado' },
        { status: 404 }
      );
    }
    
    // Deletar arquivos físicos
    if (book.coverImage) {
      const coverPath = path.join(process.cwd(), 'public', book.coverImage);
      try {
        await unlink(coverPath);
      } catch (error) {
        console.error('Erro ao deletar capa:', error);
      }
    }
    
    if (book.fileUrl && book.linkType === 'READ') {
      const pdfPath = path.join(process.cwd(), 'public', book.fileUrl);
      try {
        await unlink(pdfPath);
      } catch (error) {
        console.error('Erro ao deletar PDF:', error);
      }
    }
    
    await prisma.book.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar livro' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    
    const updates: any = {};
    
    if (formData.has('title')) updates.title = formData.get('title');
    if (formData.has('author')) updates.author = formData.get('author');
    if (formData.has('description')) updates.description = formData.get('description');
    if (formData.has('linkType')) updates.linkType = formData.get('linkType');
    if (formData.has('externalLink')) updates.externalLink = formData.get('externalLink');
    if (formData.has('isActive')) updates.isActive = formData.get('isActive') === 'true';
    
    const book = await prisma.book.update({
      where: { id: params.id },
      data: updates
    });
    
    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar livro' },
      { status: 500 }
    );
  }
}