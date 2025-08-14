'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RegisterPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      // 新規登録API
      await axios.post('/api/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // サインイン
      const res = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        setError('登録に失敗しました');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(
          message?.includes(',')
            ? message.replace(/,/g, '\n')
            : message || '通信エラーが発生しました'
        );
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-purple-500 via-purple-300 to-blue-200">
      <Card className="w-full max-w-md p-6 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <CardHeader>
            <CardTitle className="text-purple-500 text-3xl">新規登録</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Input
              id="name"
              name="name"
              placeholder="お名前"
              className="bg-purple-100/70 p-5"
              required
              value={form.name}
              onChange={onChange}
            />
            <Input
              id="email"
              name="email"
              placeholder="メールアドレス"
              className="bg-purple-100/70 p-5"
              type="email"
              required
              value={form.email}
              onChange={onChange}
            />
            <Input
              id="password"
              name="password"
              placeholder="パスワード"
              className="bg-purple-100/70 p-5"
              type="password"
              required
              value={form.password}
              onChange={onChange}
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="確認用パスワード"
              className="bg-purple-100/70 p-5"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
            {error && (
              <p className="text-red-500 text-center whitespace-pre-line">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="cursor-pointer bg-white text-purple-500 hover:text-white"
              disabled={loading}
            >
              {loading ? '登録中...' : '新規登録'}
            </Button>
            <Link href="/login">→ログインはこちら</Link>
            <Link href="/">→記事一覧はこちら</Link>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
