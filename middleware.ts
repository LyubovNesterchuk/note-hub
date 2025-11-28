import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const publicRoutes = ['/sign-in', '/sign-up'];
const privateRoutes = ['/profile', '/notes/:path*', '/notes/filter/:path*'];

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/notes/filter/:path*', '/sign-in', '/sign-up'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  
  if (!accessToken && refreshToken) {
    const sessionResponse = await checkServerSession();
    const setCookie = sessionResponse.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const response = NextResponse.next();

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
        };
        if (parsed.accessToken) response.cookies.set('accessToken', parsed.accessToken, options);
        if (parsed.refreshToken) response.cookies.set('refreshToken', parsed.refreshToken, options);
      }


      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return response;
    }
  }


  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

 
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}