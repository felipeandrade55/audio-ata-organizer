import { BrowserRouter as Router } from 'react-router-dom';
import { SupabaseProvider } from './providers/SupabaseProvider';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Importar seus componentes existentes
import Index from './pages/Index';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Index />
          <Toaster />
        </div>
      </Router>
    </SupabaseProvider>
  );
}

export default App;
