import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app.store';
import { routes } from './app.routes';
import { ToastProvider } from '../features/common/Toast';

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider router={routes} />
    </ToastProvider>
  );
}
