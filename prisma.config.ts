import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// O Next lê .env.local sozinho; a CLI do Prisma precisa carregar.
config({ path: ['.env.local', '.env'], quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // `prisma generate` não precisa de banco; migrações sim.
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
