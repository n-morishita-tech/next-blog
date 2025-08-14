import Posts from '@/components/public/Posts';
import PublicHeader from '@/components/public/PublicHeader';

export default function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <>
      <PublicHeader />
      <Posts search={searchParams.search || ''} />
    </>
  );
}
