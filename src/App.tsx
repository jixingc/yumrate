import { HashRouter, Routes, Route } from 'react-router-dom';
import { DeckView } from './pages/DeckView';
import { EntryView } from './pages/EntryView';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DeckView />} />
        <Route path="/entry" element={<EntryView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;