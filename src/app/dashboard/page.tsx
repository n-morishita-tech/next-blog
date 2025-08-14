import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import PostMenu from '@/components/private/PostMenu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: { search?: string };
}) => {
  const session = await getServerSession(authOptions);
  const search = searchParams.search || '';

  // メールアドレスからユーザーを取得
  const user = await prisma.user.findUnique({
    where: { email: session!.user.email },
  });

  if (!user) {
    return <div>ユーザーが見つかりません</div>;
  }
  // ユーザーIDで記事を取得
  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
      title: {
        contains: search,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <>
      <div className="min-h-screen px-4  bg-gradient-to-tr from-purple-500 via-purple-300 to-blue-200">
        <div className="flex justify-between items-center mb-5">
          <h2>あなたの記事一覧</h2>

          <Button
            className="bg-white text-purple-500 cursor-pointer"
            variant="outline"
            asChild
          >
            <Link href="/dashboard/posts/new">新規記事作成</Link>
          </Button>
        </div>

        <form className="flex justify-end gap-3 mb-3" action="">
          <Input
            className="w-70 bg-white"
            placeholder="タイトルで検索…"
            id="search"
            name="search"
            defaultValue={search}
          />
          <Button className="cursor-pointer">検索</Button>
        </form>

        {posts.length === 0 ? (
          <p>まだ記事がありません</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {posts.map((post) => (
              <Link href={`/dashboard/posts/${post.id}`} key={post.id}>
                <Card className="flex">
                  <CardHeader className="flex justify-between">
                    <CardTitle className="text-purple-400 text-xl">
                      {post.title}
                      <span
                        className={`text-xs ${
                          post.published ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {post.published ? '(公開中)' : '(非公開)'}
                      </span>
                    </CardTitle>
                    <PostMenu {...post} />
                  </CardHeader>
                  {post.topImage && (
                    <div className="relative w-full aspect-[16/9] mt-2 rounded-lg overflow-hidden">
                      <Image
                        src={post.topImage}
                        alt={post.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <p>投稿者：{user.name}</p>
                      <div>
                        <p>作成日時：{post.createdAt.toLocaleDateString()}</p>
                        <p>更新日時：{post.updatedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
