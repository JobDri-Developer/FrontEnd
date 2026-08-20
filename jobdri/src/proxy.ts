import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/oauth2", "/components"];
const PRODUCTION_CANONICAL_ORIGIN = "https://www.jobdri.com";
const DESKTOP_REQUIRED_PATH = "/desktop-required";
const MOBILE_USER_AGENT_PATTERN =
  /Android.*Mobile|iPhone|iPod|IEMobile|Opera Mini|webOS|BlackBerry/i;

function isMobileRequest(request: NextRequest) {
  return MOBILE_USER_AGENT_PATTERN.test(
    request.headers.get("user-agent") ?? "",
  );
}

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

  if (
    token &&
    isMobileRequest(request) &&
    pathname !== DESKTOP_REQUIRED_PATH &&
    !isPublic
  ) {
    return NextResponse.redirect(new URL(DESKTOP_REQUIRED_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
