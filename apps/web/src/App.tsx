import { useBoardStore } from './store/boardStore'
import { ClassicLayout } from './layouts/ClassicLayout'
import { TabsLayout } from './layouts/TabsLayout'

// Parents choose the layout that suits their child (Settings → Layout).
export default function App() {
  const layout = useBoardStore((s) => s.layout)
  return layout === 'classic' ? <ClassicLayout /> : <TabsLayout />
}
