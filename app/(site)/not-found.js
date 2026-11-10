import ErrorContent from '@/components/ErrorContent';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return <ErrorContent title="Page Not Found" error="The page you are looking for does not exist." />;
}
