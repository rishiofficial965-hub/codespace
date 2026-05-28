import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing, WorkspaceLayout } from '../features/sandbox';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sandbox/:sandboxId" element={<WorkspaceLayout />} />
    </Routes>
  );
}
