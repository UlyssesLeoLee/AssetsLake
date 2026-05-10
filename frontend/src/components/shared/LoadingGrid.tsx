export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="card overflow-hidden animate-pulse">
          <div className="h-36 bg-surface-elevated" />
          <div className="p-3 flex flex-col gap-2">
            <div className="h-3 bg-surface-elevated rounded w-3/4" />
            <div className="h-2 bg-surface-elevated rounded w-1/2" />
            <div className="h-2 bg-surface-elevated rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
