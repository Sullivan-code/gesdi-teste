import { PrismaClient } from '@prisma/client';

// URL FIXA do GESDI - IGNORA COMPLETAMENTE o .env
const DATABASE_URL = "postgresql://GESDI_owner:npg_OqW6oEw7FZDd@ep-cool-wind-a5mk16gg-pooler.us-east-2.aws.neon.tech/GESDI?sslmode=require&channel_binding=require";

// SOBRESCREVE a variável de ambiente
process.env.DATABASE_URL = DATABASE_URL;

declare global {
  var prisma: PrismaClient | undefined;
}

// Cria o cliente com a URL forçada
const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

console.log('✅ Conectado ao banco GESDI:', DATABASE_URL.split('@')[1]?.split('?')[0]);

export default prisma;