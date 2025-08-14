import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email, inputPassword } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: 'メールアドレスかパスワードに誤りがあります' },
        { status: 409 }
      );
    }

    const isValid = await bcrypt.compare(inputPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'メールアドレスかパスワードに誤りがあります' },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword, message: 'ログイン成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
};
