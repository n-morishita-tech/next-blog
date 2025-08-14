'use client';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface Post {
  title: string;
  id: string;
  content: string;
  createdAt: Date;
  published: boolean;
  authorId: string;
  categoryId: string | null;
  topImage: string | null;
  updatedAt: Date;
}

const PostMenu = (post: Post) => {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/posts/${post.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirm = window.confirm('この記事を削除しますか？');
    if (!confirm) return;

    try {
      await axios.delete(`/api/posts/${post.id}`);
      alert('削除しました');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>&#x2026;</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEdit}>編集</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>削除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
