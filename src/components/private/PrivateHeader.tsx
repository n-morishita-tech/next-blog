'use client';
import Link from 'next/link';
import ProfileMenu from './ProfileMenu';

type User = {
  name?: string | null;
  email?: string | null;
};

interface PrivateHeaderProps {
  user: User;
}

const PrivateHeader = ({ user }: PrivateHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center p-3 bg-purple-400">
        <span className="mr-4 text-white">
          <Link href="/dashboard">管理ページ</Link>
        </span>
        <div className="flex items-center gap-2">
          <span>ユーザー名：{user.name}</span>
          <ProfileMenu
            user={{
              name: user.name ?? '名無し',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              image: (user as any).image,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default PrivateHeader;
