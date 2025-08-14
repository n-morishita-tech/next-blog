import Link from 'next/link';
import { Button } from '../ui/button';

const PublicHeader = () => {
  return (
    <div className="flex justify-end items-center bg-purple-400 h-15 p-5 ">
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/login">ログイン</Link>
        </Button>
        <Button variant="outline" asChild className="bg-black text-white">
          <Link href="register">新規登録</Link>
        </Button>
      </div>
    </div>
  );
};

export default PublicHeader;
