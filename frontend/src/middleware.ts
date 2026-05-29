/*
```cypher
CREATE
  (f:File {name: "middleware.ts", type: "file", language: "typescript"}),
  (m:Module {name: "@/middleware", type: "module"}),
  (fn1:Function {name: "middleware", type: "function", language: "typescript", signature: "export function middleware(request: NextRequest)"}),
  (fn2:Function {name: "rewriteAppPath", type: "function", language: "typescript", signature: "function rewriteAppPath(pathname: string): string | undefined"}),
  (v1:Variable {name: "APP_PATH_REWRITES", type: "variable"}),
  (v2:Variable {name: "config", type: "variable"}),
  (v3:Variable {name: "request", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (fn1)-[:CALLS]->(fn2),
  (fn1)-[:USES]->(v3),
  (fn2)-[:USES]->(v1);
```
*/

import { NextResponse, type NextRequest } from 'next/server';

const APP_PATH_REWRITES: Array<[prefix: string, fallback: string]> = [
  ['/app/assets', '/assets'],
  ['/app/production', '/board'],
  ['/app/planning', '/planning'],
  ['/app/workflow', '/workflow'],
  ['/app/identity', '/verification'],
  ['/app/reports', '/reports'],
  ['/app/observability', '/observability'],
];

export function middleware(request: NextRequest) {
  const rewrittenPath = rewriteAppPath(request.nextUrl.pathname);
  if (!rewrittenPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = rewrittenPath;
  return NextResponse.rewrite(url);
}

function rewriteAppPath(pathname: string): string | undefined {
  for (const [prefix, fallback] of APP_PATH_REWRITES) {
    if (pathname === prefix) {
      return fallback;
    }
    if (pathname.startsWith(`${prefix}/`)) {
      const suffix = pathname.slice(prefix.length);
      if (prefix === '/app/assets') {
        if (suffix === '/upload' || suffix.startsWith('/upload/')) {
          return suffix;
        }
        if (suffix === '/data-lake-query' || suffix.startsWith('/data-lake-query/')) {
          return suffix;
        }
        return `/assets${suffix}`;
      }
      return suffix === '/' ? fallback : suffix;
    }
  }

  return undefined;
}

export const config = {
  matcher: ['/app/:path*'],
};
