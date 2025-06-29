// This middleware has been disabled and replaced by server-side checks in layouts.
// This file is kept to prevent build errors.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
