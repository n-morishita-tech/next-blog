import PrivateHeader from '@/components/private/PrivateHeader';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

const PrivateLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <div>
        ログインしてください
        <br />
        <Link href="/login" className="cursor-pointer text-blue-400">
          →ログインはこちら
        </Link>
      </div>
    );
  }

  // メールアドレスからユーザーを取得
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }

  return (
    <>
      <PrivateHeader user={user} />
      <div className="min-h-screen px-4 py-10 bg-gradient-to-tr from-purple-500 via-purple-300 to-blue-200">
        {children}
      </div>
    </>
  );
};

export default PrivateLayout;
