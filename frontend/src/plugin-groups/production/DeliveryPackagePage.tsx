/*
```cypher
CREATE
  (f:File {name: "DeliveryPackagePage.tsx", type: "file", language: "typescript"}),
  (m:Module {name: "@/plugin-groups/production/DeliveryPackagePage", type: "module"}),
  (fn1:Function {name: "DeliveryPackagePage", type: "function", language: "typescript", signature: "function DeliveryPackagePage()"}),
  (fn2:Function {name: "submitPackage.mutationFn", type: "function", language: "typescript", signature: "(id: string) => Promise<unknown>"}),
  (fn3:Function {name: "toggleAsset", type: "function", language: "typescript", signature: "const toggleAsset = (assetId: string) => void"}),
  (v1:Variable {name: "assetsData", type: "variable"}),
  (v2:Variable {name: "createPackage", type: "variable"}),
  (v3:Variable {name: "selectedAssetIds", type: "variable"}),
  (v4:Variable {name: "name", type: "variable"}),
  (f)-[:CONTAINS]->(m),
  (m)-[:CONTAINS]->(fn1),
  (fn1)-[:CONTAINS]->(fn2),
  (fn1)-[:CONTAINS]->(fn3),
  (fn1)-[:USES]->(v1),
  (fn1)-[:USES]->(v2),
  (fn1)-[:USES]->(v3),
  (fn1)-[:USES]->(v4),
  (fn1)-[:CALLS]->(fn3);
```
*/

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ImageIcon, PackageCheck, Send } from 'lucide-react';

import { useAssets } from '@/hooks/useAssets';
import { useCreateDeliveryPackage } from '@/hooks/useProduction';
import { productionApi } from '@/lib/productionApi';
import {
  DEFAULT_CLIENT_ID,
  DEFAULT_PROJECT_ID,
  DEFAULT_VENDOR_ID,
  Metric,
  PageHeader,
} from '@/plugin-groups/production/ProductionPluginPrimitives';

export function DeliveryPackagePage() {
  const { data: assetsData, isLoading } = useAssets({ status: 'active', page_size: 100 });
  const createPackage = useCreateDeliveryPackage();
  const submitPackage = useMutation({
    mutationFn: (id: string) => productionApi.deliveryPackages.submit(id, { actor: 'delivery-manager' }),
  });
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [name, setName] = useState('Approved Art Delivery');

  const toggleAsset = (assetId: string) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Delivery Package"
        subtitle={`${selectedAssetIds.length} approved assets selected`}
        actions={
          <button
            className="btn-primary"
            disabled={selectedAssetIds.length === 0 || createPackage.isPending}
            onClick={() =>
              createPackage.mutate({
                project_id: DEFAULT_PROJECT_ID,
                vendor_id: DEFAULT_VENDOR_ID,
                client_id: DEFAULT_CLIENT_ID,
                name,
                asset_ids: selectedAssetIds,
              })
            }
          >
            <PackageCheck className="h-4 w-4" />
            Create Package
          </button>
        }
      />

      <div className="grid flex-1 gap-4 overflow-y-auto p-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-surface-border bg-surface-secondary">
          <div className="border-b border-surface-border p-4">
            <label className="label">Package Name</label>
            <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="divide-y divide-surface-border">
            {(assetsData?.data ?? []).map((asset) => (
              <label key={asset.id} className="flex cursor-pointer items-center gap-3 p-4">
                <input
                  type="checkbox"
                  checked={selectedAssetIds.includes(asset.id)}
                  onChange={() => toggleAsset(asset.id)}
                />
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-surface-elevated">
                  {asset.preview_url || asset.file_url ? (
                    <img
                      src={asset.preview_url || asset.file_url}
                      alt={asset.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-100">{asset.name}</div>
                  <div className="text-xs text-slate-500">
                    v{asset.version} - {asset.asset_type} - {asset.uploader}
                  </div>
                </div>
              </label>
            ))}
            {!isLoading && (assetsData?.data ?? []).length === 0 && (
              <div className="p-6 text-sm text-slate-500">No approved assets</div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <Metric label="Approved Assets" value={assetsData?.total ?? 0} />
          <Metric label="Selected" value={selectedAssetIds.length} tone="text-brand-300" />
          {createPackage.data && (
            <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-sm font-medium text-emerald-200">{createPackage.data.name}</div>
              <div className="mt-1 text-xs text-emerald-300">{createPackage.data.status}</div>
              <button
                className="btn-primary mt-3 w-full justify-center"
                disabled={submitPackage.isPending}
                onClick={() => submitPackage.mutate(createPackage.data.id)}
              >
                <Send className="h-4 w-4" />
                Submit
              </button>
              {submitPackage.data && (
                <div className="mt-3 rounded-md border border-brand-300/30 bg-brand-400/10 px-3 py-2 text-xs text-brand-100">
                  Submitted by {submitPackage.data.submitted_by ?? 'delivery-manager'} / {submitPackage.data.status}
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

export default DeliveryPackagePage;
