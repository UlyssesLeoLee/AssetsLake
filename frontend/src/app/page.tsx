import Link from 'next/link';
import { Database, Upload, Search, Layers, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
          Asset Lake — Production Ready
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          AI Art Asset Management
          <span className="block text-gradient">for Professional Teams</span>
        </h1>

        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          A production-grade asset pipeline for game studios, animation teams, and outsourcing
          workflows. MinIO object storage, PostgreSQL metadata, and AI-ready extensibility.
        </p>

        <div className="flex items-center gap-4 justify-center flex-wrap">
          <Link href="/assets" className="btn-primary text-base px-6 py-3">
            Browse Assets
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/upload" className="btn-secondary text-base px-6 py-3">
            <Upload className="w-4 h-4" />
            Upload Assets
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
        <FeatureCard
          icon={<Database className="w-5 h-5 text-brand-400" />}
          title="MinIO Object Storage"
          description="FBX, Blend, PSD, PNG, WAV, MP4, ZIP — all asset types stored with unique object keys"
        />
        <FeatureCard
          icon={<Layers className="w-5 h-5 text-purple-400" />}
          title="PostgreSQL Metadata"
          description="Tags, versions, projects, status lifecycle, uploader tracking, and soft-delete"
        />
        <FeatureCard
          icon={<Search className="w-5 h-5 text-cyan-400" />}
          title="Filter & Search"
          description="Filter by type, status, project, and tags. Full-text search across filenames and descriptions"
        />
        <FeatureCard
          icon={<Upload className="w-5 h-5 text-emerald-400" />}
          title="Upload Pipeline"
          description="Drag-drop upload with progress tracking, MIME detection, SHA-256 checksums, and hooks for AI pipeline"
        />
      </div>

      {/* Extension roadmap */}
      <div className="mt-16 max-w-4xl mx-auto w-full">
        <h2 className="text-sm font-medium text-slate-500 text-center mb-4 uppercase tracking-wider">
          Extensibility Roadmap
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            'Qdrant Vector Search',
            'OpenSearch Full-Text',
            'Neo4j Dependency Graph',
            'Kafka Event Pipeline',
            'AI Auto-Tagging',
            'Thumbnail Generation',
            'Version Comparison',
            'Review Workflow',
            'Outsourcing Delivery',
            'Role-Based Access Control',
          ].map((item) => (
            <span
              key={item}
              className="px-3 py-1 rounded-full text-xs bg-surface-elevated border border-surface-border text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-5 hover:border-brand-500/30 transition-colors duration-200">
      <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
