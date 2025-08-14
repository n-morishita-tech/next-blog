import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import ProfileEditModal from './ProfileEditModal';
import Image from 'next/image';
const ProfileMenu = ({ user }: { user: { name: string; image?: string } }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="w-11 h-11 rounded-full overflow-hidden">
            <Image
              src={user.image || '/noAvatar.png'}
              alt="avatar"
              className="w-full h-full object-contain"
              width={150}
              height={150}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <ProfileEditModal currentName={user.name} currentImage={user.image} />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-md"
          >
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ProfileMenu;
