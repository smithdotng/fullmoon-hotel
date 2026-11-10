import { getSession } from '@/lib/session';
import { redirectTo } from '@/lib/http';

export async function GET(request) {
  const session = await getSession();
  session.destroy();
  return redirectTo(request, '/');
}
