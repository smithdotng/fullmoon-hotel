import { redirectTo } from '@/lib/http';

// Old subscriber admin URL -> the admin panel page
export function GET(request) {
  return redirectTo(request, '/admin/subscribers');
}
