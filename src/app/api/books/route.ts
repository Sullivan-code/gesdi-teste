import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const linkType = formData.get('linkType') as string;
    const externalLink = formData.get('externalLink') as string;
    const createdBy = formData.get('createdBy') as string;
    
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
    
    // Upload do PDF
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
    
    // Verificar quais campos existem no schema
    // Tente primeiro com os campos novos, se falhar, use os antigos
    let book;
    try {
      // Tentativa com schema novo
      book = await prisma.book.create({
        data: {
          title,
          author,
          description: description || null,
          coverImage: coverImageUrl,
          fileUrl: pdfUrl,
          linkType: linkType as any,
          externalLink: externalLink || null,
          createdBy: createdBy || null,
          isActive: true
        }
      });
    } catch (error: any) {
      // Se falhar, tenta com schema antigo
      console.log('Tentando com schema antigo...');
      book = await prisma.book.create({
        data: {
          title,
          author,
          description: description || null,
          coverUrl: coverImageUrl, // Campo antigo
          fileUrl: pdfUrl,
          buyLink: linkType === 'BUY' ? externalLink : null,
          buttonText: linkType === 'BUY' ? 'Comprar Livro' : 'Ler Livro',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
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
    let books;
    try {
      // Tentativa com schema novo
      books = await prisma.book.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      // Se falhar, busca sem o filtro isActive
      console.log('Buscando com schema antigo...');
      books = await prisma.book.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
    
    return NextResponse.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar livros: ' + (error as Error).message },
      { status: 500 }
    );
  }
}