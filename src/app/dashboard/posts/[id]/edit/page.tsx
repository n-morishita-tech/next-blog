'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  topImage: string | null;
}

const PostEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost({
          ...res.data,
          published: Boolean(res.data.published),
        });
        setPreview(res.data.topImage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!post) return;

    try {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('published', String(post.published));
      if (file) {
        formData.append('image', file);
      }

      await axios.put(`/api/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!post) return <p>記事が見つかりません</p>;

  return (
    <Card className="mt-5 w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex justify-between items-center w-full">
          <span className="text-purple-400 text-2xl">記事編集</span>
          <Button className="cursor-pointer" onClick={handleSave}>
            登録する
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="m-3">
              タイトル
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="タイトルを入力してください"
              required
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
            <Label htmlFor="content" className="m-3">
              記事内容
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="内容を入力してください"
              required
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
            <Label htmlFor="image" className="m-3">
              画像
            </Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="w-full max-w-md mx-auto">
                <Image
                  src={preview}
                  alt="preview"
                  width={500}
                  height={300}
                  className="object-contain rounded-lg shadow-md"
                  style={{ width: '100%', height: 'auto' }} // アスペクト比を自動調整
                />
              </div>
            )}
            <Switch
              className="m-4"
              checked={Boolean(post.published)}
              onCheckedChange={(value) =>
                setPost({ ...post, published: value })
              }
            />
            <p>{post.published ? '公開' : '非公開'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostEditPage;
