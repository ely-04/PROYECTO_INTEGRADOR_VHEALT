import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import PlantasMedicinales from './pages/PlantasMedicinales';
import Enfermedades from './pages/Enfermedades';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-stone-50/50">
        <Header />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plantas" element={<PlantasMedicinales />} />
            <Route path="/enfermedades" element={<Enfermedades />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
