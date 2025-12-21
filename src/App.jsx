import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import { AudioProvider } from './context/AudioContext';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import { useTelegram } from './hooks/useTelegram';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  useTelegram(); // Initialize UA initialization

  return (
    <ErrorBoundary>
      <AudioProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="cart" element={<CartPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;
