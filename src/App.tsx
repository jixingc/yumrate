import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomeView } from './pages/HomeView';
import { DeckView } from './pages/DeckView';
import { EntryView } from './pages/EntryView';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/explore" element={<DeckView />} />
        <Route path="/entry" element={<EntryView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;