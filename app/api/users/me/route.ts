export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { parse } from "cookie";
import { logErrorResponse } from '../../_utils/utils';
import { api } from '../../api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

  
    if (refreshToken) {
      const apiRes = await api.get("/auth/session", { 
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];
      const res = NextResponse.json({ success: true }, { status: 200 });

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options: Record<string, any> = {
            path: parsed.Path || "/", 
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };

          if (parsed.accessToken) res.cookies.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken) res.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }

      return res;
    }

    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false }, { status: 200 });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false }, { status: 200 });
  }
}


// export async function GET() {
//   try {
//     const cookieStore = await cookies();

//     const res = await api.get('/users/me', {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.status }
//       );
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function PATCH(request: Request) {
//   try {
//     const cookieStore = await cookies();
//     const body = await request.json();

//     const res = await api.patch('/users/me', body, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return NextResponse.json(res.data, { status: res.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.status }
//       );
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }