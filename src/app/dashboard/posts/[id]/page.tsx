import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ArticleDetailProps = {
  params: {
    id: string;
  };
};

const ArticleDetailPage = async ({ params }: ArticleDetailProps) => {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }
  return (
    <div className="max-w-4xl mx-auto my-10 p-4">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-2xl font-semibold text-purple-400">
            {post.title}
            <span
              className={`text-sm font-medium ml-2 ${
                post.published ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {post.published ? '公開中' : '非公開'}
            </span>
          </CardTitle>
          <div className="text-sm text-gray-500">
            カテゴリー: {post.category?.name || '未分類'}
          </div>
        </CardHeader>

        {post.topImage && (
          <div className="relative w-full aspect-[16/9] mt-4 rounded overflow-hidden">
            <Image
              src={post.topImage}
              alt="topImage"
              fill
              className="object-contain rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <CardContent className="prose max-w-none mt-6 whitespace-pre-wrap">
          {post.content}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0">
          <p>
            投稿者：<span className="font-medium">{post.author.name}</span>
          </p>
          <div className="flex space-x-6">
            <p>作成日: {post.createdAt.toLocaleDateString()}</p>
            <p>更新日: {post.updatedAt.toLocaleDateString()}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleDetailPage;
