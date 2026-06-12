import { PluginRouteHost } from '@/plugin-groups/route-host';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <PluginRouteHost pathname="/observability" expectedRouteId="observability.runtime" />;
}
