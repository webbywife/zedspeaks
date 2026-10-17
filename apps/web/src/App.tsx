import { Navigate } from 'react-router-dom'
import { useBoardStore } from './store/boardStore'
import { ClassicLayout } from './layouts/ClassicLayout'
import { TabsLayout } from './layouts/TabsLayout'
import { useActiveProfile } from './store/profileStore'

// Parents choose the layout that suits their child (Settings → Layout).
// Each child has their own board: without a chosen child, go back to "Who's talking?".
export default function App({ requireProfile = true }: { requireProfile?: boolean }) {
  const layout = useBoardStore((s) => s.layout)
  const active = useActiveProfile()
  if (requireProfile && !active) return <Navigate to="/start" replace />
  return layout === 'classic' ? <ClassicLayout /> : <TabsLayout />
}
