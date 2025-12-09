
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detector from './pages/Detector';
import WAGVisualization from './pages/WAGVisualization';
import RAGVisualization from './pages/RAGVisualization';
import AboutDeadlock from './pages/AboutDeadlock';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-neon-pink selection:text-white">
      <HashRouter>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detector" element={<Detector />} />
            <Route path="/wag" element={<WAGVisualization />} />
            <Route path="/rag" element={<RAGVisualization />} />
            <Route path="/about" element={<AboutDeadlock />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
    </div>
  );
};

export default App;
