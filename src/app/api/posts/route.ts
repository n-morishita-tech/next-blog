import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = (formData.get('published') as string) === 'true';
  const file = formData.get('image') as File | null;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let imageUrl = null;
    if (file) {
      // 生のバイト配列とBuffer型に変換
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //  ファイル名、アップロード先作成
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      // 作成
      await fs.writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        topImage: imageUrl,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
};
