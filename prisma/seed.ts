import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const main = async () => {
  // 1. ユーザー作成
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      password: passwordHash,
    },
  });

  // 2. カテゴリ作成
  const cat1 = await prisma.category.create({ data: { name: 'Tech' } });
  const cat2 = await prisma.category.create({ data: { name: 'Life' } });

  // 3. タグ作成
  const tag1 = await prisma.tag.create({ data: { name: 'Next.js' } });
  const tag2 = await prisma.tag.create({ data: { name: 'Prisma' } });

  // 4. 記事作成
  const dummyImages = [
    'https://picsum.photos/seed/post1/600/400',
    'https://picsum.photos/seed/post2/600/400',
  ];

  const post1 = await prisma.post.create({
    data: {
      title: 'My First Blog Post',
      content: 'This is the content of the first blog post.',
      published: true,
      authorId: user1.id,
      categoryId: cat1.id,
      topImage: dummyImages[0],
      tags: { connect: [{ id: tag1.id }, { id: tag2.id }] },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'A Day in My Life',
      content: 'This is a personal diary entry.',
      published: false,
      authorId: user2.id,
      categoryId: cat2.id,
      topImage: dummyImages[1],
      tags: { connect: [{ id: tag2.id }] },
    },
  });

  // 5. コメント作成
  await prisma.comment.createMany({
    data: [
      { content: 'Great post!', authorId: user2.id, postId: post1.id },
      { content: 'Thanks for sharing!', authorId: user1.id, postId: post2.id },
    ],
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
