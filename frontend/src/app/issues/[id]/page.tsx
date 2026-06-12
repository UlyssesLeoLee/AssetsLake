import { PluginRouteHost } from '@/plugin-groups/route-host';
export default function Page({ params }: { params: { id: string } }) {
  return (
    <PluginRouteHost pathname={`/issues/${params.id}`} expectedRouteId="production.board.detail" />
  );
}
