import { prisma } from '@/lib/prisma';
import Image from 'next/image';

const PostDetail = async ({ params }: { params: { id: string } }) => {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
    },
  });

  if (!post) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-tr from-purple-500 via-purple-300 to-blue-200">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        {post.topImage && (
          <div className="w-full max-w-3xl mx-auto mb-4 rounded overflow-hidden">
            <Image
              src={post.topImage}
              alt={post.title}
              width={800}
              height={500}
              className="object-contain rounded-lg shadow-md"
              style={{ width: '100%', height: 'auto' }}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-gray-700">{post.content}</p>
          <div>
            <p className="text-sm text-gray-500">
              作成日時： {post.createdAt.toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              更新日時： {post.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-5">投稿者：{post.author.name}</div>
      </div>
    </div>
  );
};

export default PostDetail;
