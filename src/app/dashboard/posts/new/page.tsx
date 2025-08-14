'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const CreateArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFIle] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFIle(file);

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('タイトルと内容は必須です');
      return;
    }

    // 入力内容追加
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', String(isPublished));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // 記事作成
    try {
      await axios.post('/api/posts', formData);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('作成に失敗しました');
    }
  };

  return (
    <Card className="mt-5 w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex justify-between items-center w-full">
          <span className="text-purple-400 text-2xl">新規記事登録</span>
          <Button onClick={handleSubmit} className="cursor-pointer">
            作成する
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Label htmlFor="content" className="m-3">
              記事内容
            </Label>
            <Textarea
              id="content"
              name="content"
              placeholder="内容を入力してください"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Label htmlFor="image" className="m-3">
              画像
            </Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="preview"
                className="my-w max-w-xs "
                width={500}
                height={500}
              />
            )}
            <Switch
              className="m-4"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked)}
            />
            <p>{isPublished ? '公開' : '非公開'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateArticlePage;
