'use client';
import ErrorContent from '@/components/ErrorContent';

export default function SiteError() {
  return <ErrorContent title="Server Error" error="Something went wrong! Please try again later." />;
}
