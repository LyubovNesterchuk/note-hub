import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { isAxiosError } from "axios";

import { logErrorResponse } from "../../_utils/utils";
import { api } from "../../api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Якщо є accessToken — сесія валідна
    if (accessToken) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Якщо немає accessToken, але є refreshToken — пробуємо оновити сесію через бекенд
    if (refreshToken) {
      const apiRes = await api.get("/auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
        // важливо для куків
        withCredentials: true,
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

          if (parsed.accessToken) {
            res.cookies.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            res.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }
      }

      return res;
    }

    // Нема ні accessToken, ні refreshToken
    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { success: false, error: error.message, backend: error.response?.data },
        { status: 200 } // ти так уже робиш, я залишаю
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;
//     const refreshToken = cookieStore.get("refreshToken")?.value;

//     if (accessToken) {
//       return NextResponse.json({ success: true });
//     }

//     if (refreshToken) {
//       const apiRes = await api.get("/auth/session", {
//         headers: {
//           Cookie: cookieStore.toString(),
//         },
//       });

//       const setCookie = apiRes.headers["set-cookie"];

//       if (setCookie) {
//         const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
//         for (const cookieStr of cookieArray) {
//           const parsed = parse(cookieStr);

//           const options = {
//             expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
//             path: parsed.Path,
//             maxAge: Number(parsed["Max-Age"]),
//           };

//           if (parsed.accessToken)
//             cookieStore.set("accessToken", parsed.accessToken, options);
//           if (parsed.refreshToken)
//             cookieStore.set("refreshToken", parsed.refreshToken, options);
//         }
//         return NextResponse.json({ success: true }, { status: 200 });
//       }
//     }
//     return NextResponse.json({ success: false }, { status: 200 });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       logErrorResponse(error.response?.data);
//       return NextResponse.json({ success: false }, { status: 200 });
//     }
//     logErrorResponse({ message: (error as Error).message });
//     return NextResponse.json({ success: false }, { status: 200 });
//   }
// }