import React from 'react';
import Router from './routes/Router';
import { Toaster } from 'sonner';

function App() {
  return <><Router /><Toaster position="top-right" richColors closeButton /></>;
}

export default App;
