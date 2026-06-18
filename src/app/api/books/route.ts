import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    
    // Validate required fields
    if (!title || !author) {
      return NextResponse.json(
        { success: false, error: 'Title and author are required' },
        { status: 400 }
      );
    }
    
    // Upload da capa
    const coverImageFile = formData.get('coverImage') as File;
    let coverImageUrl = '';
    
    if (coverImageFile && coverImageFile.size > 0) {
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
    }
    
    // Upload do PDF (only if linkType is READ)
    const pdfFile = formData.get('fileUrl') as File;
    let pdfUrl = '';
    
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
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
    }

    // Create book with the correct schema
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description: description || null,
        coverImage: coverImageUrl,
        fileUrl: pdfUrl,
        linkType: linkType as any || 'BUY',
        externalLink: externalLink || null,
        createdBy: user.id,
        isActive: true
      }
    });
    
    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar livro: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

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

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    const isActive = formData.get('isActive') === 'true';

    // Upload da capa (if new file provided)
    const coverImageFile = formData.get('coverImage') as File;
    let coverImageUrl = existingBook.coverImage;
    
    if (coverImageFile && coverImageFile.size > 0) {
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
    }

    // Upload do PDF (if new file provided)
    const pdfFile = formData.get('fileUrl') as File;
    let pdfUrl = existingBook.fileUrl;
    
    if (pdfFile && pdfFile.size > 0 && linkType === 'READ') {
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
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: title || existingBook.title,
        author: author || existingBook.author,
        description: description || existingBook.description,
        coverImage: coverImageUrl,
        fileUrl: pdfUrl,
        linkType: linkType as any || existingBook.linkType,
        externalLink: externalLink || existingBook.externalLink,
        isActive: isActive !== undefined ? isActive : existingBook.isActive,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar livro: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }

    // Soft delete or hard delete? 
    // Using soft delete (just deactivate)
    await prisma.book.update({
      where: { id },
      data: { isActive: false }
    });

    // For hard delete, uncomment this:
    // await prisma.book.delete({
    //   where: { id }
    // });

    return NextResponse.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar livro: ' + (error as Error).message },
      { status: 500 }
    );
  }
}