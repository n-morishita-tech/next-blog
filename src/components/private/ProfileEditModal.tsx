'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import axios from 'axios';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

interface ProfileEditModalProps {
  currentName: string;
  currentImage?: string;
}

const ProfileEditModal = ({
  currentName,
  currentImage,
}: ProfileEditModalProps) => {
  const [name, setName] = useState(currentName);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    let imageUrl = preview;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      // 古いファイル名を渡す
      if (currentImage?.startsWith('/uploads/')) {
        formData.append('oldFilePath', currentImage || '');
      }

      try {
        const res = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = res.data.url;
      } catch (error) {
        console.error('Upload failed', error);
      }
    }

    // DB更新
    try {
      await axios.put('/api/user/update', {
        name,
        image: imageUrl,
      });
    } catch (error) {
      console.error('ユーザー情報更新に失敗しました', error);
    }

    setLoading(false);
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-transparent border-none  mt-1 ml-2 cursor-pointer text-md">
          編集
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィール画像を変更</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }
            }}
          />
          {preview && (
            <Image
              src={preview}
              alt="preview"
              className="mt-2 max-h-48 object-cover"
              width={70}
              height={70}
            />
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">キャンセル</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
