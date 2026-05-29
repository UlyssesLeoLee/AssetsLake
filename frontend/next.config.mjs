/*
```cypher
CREATE
  (f:File {name: "next.config.mjs", type: "file", language: "javascript"}),
  (m:Module {name: "frontend/next.config", type: "module"}),
  (fn1:Function {name: "hasPackageManifest", type: "function", language: "javascript", signature: "function hasPackageManifest(managedPath)"}),
  (fn2:Function {name: "keepManagedPath", type: "function", language: "javascript", signature: "function keepManagedPath(managedPath)"}),
  (fn3:Function {name: "webpack", type: "function", language: "javascript", signature: "webpack(config)"}),
  (fn4:Function {name: "rewrites", type: "function", language: "javascript", signature: "async rewrites()"}),
  (v1:Variable {name: "standaloneOutput", type: "variable"}),
  (v2:Variable {name: "nextConfig", type: "variable"}),
  (v3:Variable {name: "NEXT_OUTPUT_MODE", type: "variable"}),
  (v4:Variable {name: "managedPath", type: "variable"}),
  (v5:Variable {name: "config", type: "variable"}),
  (v6:Variable {name: "infrastructureLogging", type: "variable"}),
  (v7:Variable {name: "KIALI_PROXY_URL", type: "variable"}),
  (v8:Variable {name: "kialiProxyUrl", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (m)-[:CONTAINS]->(fn2),
  (m)-[:CONTAINS]->(fn3),
  (m)-[:CONTAINS]->(fn4),
  (fn1)-[:USES]->(v4),
  (fn2)-[:CALLS]->(fn1),
  (fn2)-[:USES]->(v4),
  (fn3)-[:CALLS]->(fn2),
  (fn3)-[:USES]->(v5),
  (fn3)-[:USES]->(v6),
  (fn4)-[:USES]->(v8),
  (m)-[:USES]->(v1),
  (m)-[:USES]->(v2),
  (m)-[:USES]->(v8),
  (v1)-[:USES]->(v3),
  (v8)-[:USES]->(v7),
  (v2)-[:USES]->(v1);
```
*/

import { existsSync } from 'node:fs';
import { join } from 'node:path';

const standaloneOutput = process.env.NEXT_OUTPUT_MODE === 'standalone';
const kialiProxyUrl = process.env.KIALI_PROXY_URL || 'http://127.0.0.1:20001';

function hasPackageManifest(managedPath) {
  return typeof managedPath !== 'string' || existsSync(join(managedPath, 'package.json'));
}

function keepManagedPath(managedPath) {
  if (typeof managedPath !== 'string') {
    return true;
  }

  const normalizedPath = managedPath.replaceAll('\\', '/');
  if (!normalizedPath.includes('/node_modules/@next/swc-')) {
    return true;
  }

  return hasPackageManifest(managedPath);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(standaloneOutput ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack(config) {
    if (Array.isArray(config.snapshot?.managedPaths)) {
      config.snapshot.managedPaths = config.snapshot.managedPaths.filter(keepManagedPath);
    }

    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      level: 'error',
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/kiali',
        destination: `${kialiProxyUrl}/kiali`,
      },
      {
        source: '/kiali/:path*',
        destination: `${kialiProxyUrl}/kiali/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
