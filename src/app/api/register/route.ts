import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { validate } from '@/lib/validate';

// バリデーションスキーマ
const registerSchema = z.object({
  name: z
    .string()
    .min(5, '名前は5文字以上で入力してください')
    .max(15, '名前は15文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレスは入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, password } = validate(registerSchema, body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'そのメールアドレスは既に使われています' },
        { status: 409 }
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);
    // ユーザー作成
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: '登録成功' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
};
