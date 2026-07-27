import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/oauth2", "/components"];
const PRODUCTION_CANONICAL_ORIGIN = "https://www.jobdri.com";

function getRequestHost(request: NextRequest) {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  return (forwardedHost || request.headers.get("host") || request.nextUrl.host)
    .toLowerCase()
    .replace(/\.$/, "");
}

function redirectToCanonicalDomain(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "production") {
    return null;
  }

  const canonicalUrl = new URL(PRODUCTION_CANONICAL_ORIGIN);

  if (getRequestHost(request) === canonicalUrl.host) {
    return null;
  }

  canonicalUrl.pathname = request.nextUrl.pathname;
  canonicalUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(canonicalUrl, 307);
  response.headers.set("Cache-Control", "no-store");

  return response;
}

export function proxy(request: NextRequest) {
  const canonicalRedirect = redirectToCanonicalDomain(request);

  if (canonicalRedirect) {
    return canonicalRedirect;
  }

  const token = request.cookies.get("jobdri_accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|test).*)"],
};
