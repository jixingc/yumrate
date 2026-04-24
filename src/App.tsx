import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeckView } from './pages/DeckView';
import { EntryView } from './pages/EntryView';
import { LoginView } from './pages/LoginView';
import { AuthProvider } from './components/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DeckView />} />
          <Route path="/login" element={<LoginView />} />
          <Route
            path="/entry"
            element={
              <ProtectedRoute>
                <EntryView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
