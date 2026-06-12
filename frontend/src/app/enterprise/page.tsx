import { PluginRouteHost } from '@/plugin-groups/route-host';
export default function Page() {
  return <PluginRouteHost pathname="/enterprise" expectedRouteId="production.enterprise" />;
}
