import { lucia } from '../lib/auth';
import { prisma } from '../lib/prisma';
import { Argon2id } from 'oslo/password';

async function main() {
  const password = await new Argon2id().hash('password')
  const user = await prisma.user.upsert({
    where: {
      email: 'test@test.com',
    },
    update: {},
    create: {
      email: 'test@test.com',
      username: 'testuser',
      password,
      createdAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      updatedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      sessions: {}
    },
  });
}