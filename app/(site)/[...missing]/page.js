import { notFound } from 'next/navigation';

// Any URL no other route matches gets the themed 404 page
export default function CatchAll() {
  notFound();
}
