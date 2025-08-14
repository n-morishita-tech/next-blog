import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Posts = async ({ search }: { search: string }) => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: search,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-tr from-purple-500 via-purple-300 to-blue-200">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">
        最新記事一覧
      </h1>
      <form action="">
        <div className="flex justify-end gap-2">
          <Input
            className="bg-white w-70 mb-5"
            placeholder="タイトルで検索…"
            id="search"
            name="search"
            defaultValue={search}
          />
          <Button className="cursor-pointer">検索</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {posts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <Card className="flex">
                <CardHeader>
                  <CardTitle className="text-purple-600">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                {post.topImage && (
                  <div className="relative w-full aspect-[16/9] mb-2 rounded-lg overflow-hidden">
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
                  <p className="line-clamp-3">{post.content}</p>
                </CardContent>
                <CardFooter className="text-sm text-gray-700">
                  <div className="flex justify-between w-full">
                    <p>投稿者：{post.author.name}</p>
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
      </form>
    </div>
  );
};

export default Posts;
