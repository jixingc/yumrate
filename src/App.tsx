import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeckView } from './pages/DeckView';
import { EntryView } from './pages/EntryView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeckView />} />
        <Route path="/entry" element={<EntryView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
