import { NextResponse } from "next/server";
import { ACCOUNT_COOKIE } from "@/lib/account";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.delete(ACCOUNT_COOKIE);
  return response;
}
