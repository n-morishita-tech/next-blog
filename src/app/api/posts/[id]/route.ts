import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs/promises';

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
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
    // 現在の投稿データを取得
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let imageUrl = existingPost.topImage;
    if (file && file.size > 0) {
      if (existingPost.topImage) {
        const oldImagePath = path.join(
          process.cwd(),
          'public',
          existingPost.topImage
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.warn('古い画像削除エラー:', error);
        }
      }

      // 新しい画像を保存
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      await fs.writeFile(filepath, buffer);

      imageUrl = `/uploads/${filename}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        published,
        topImage: imageUrl,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' });
  }

  try {
    // 記事を取得
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Not Found' });
    }

    // 記事の所有者確認
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' });
    }

    // 画像ファイルがある場合は削除
    if (post.topImage) {
      const imagePath = path.join(process.cwd(), 'public', post.topImage);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.warn('画像ファイル削除エラー', error);
      }
    }

    // 記事を削除
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: '削除完了' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
