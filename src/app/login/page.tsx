'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);

    try {
      await axios.post('/api/login', {
        email,
        inputPassword: password,
      });

      // サインイン
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message);
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
            <CardTitle className="text-purple-500 text-3xl">ログイン</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Input
              id="email"
              name="email"
              placeholder="メールアドレス"
              className="bg-purple-100/70 p-5"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              placeholder="パスワード"
              className="bg-purple-100/70 p-5"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
            <Link href="/register">→新規登録はこちら</Link>
            <Link href="/">→記事一覧はこちら</Link>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
