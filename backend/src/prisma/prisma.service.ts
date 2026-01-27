import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client'; // ← Nota la ruta
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Crear el pool de conexiones de PostgreSQL
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Crear el adaptador
    const adapter = new PrismaPg(pool);

    // Inicializar PrismaClient con el adaptador
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Connected to PostgreSQL');
  }
}
