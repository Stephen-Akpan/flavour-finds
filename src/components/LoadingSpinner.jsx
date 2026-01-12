import React from 'react';
import { Loader } from 'lucide-react';

export const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <Loader size={48} className="spinner" style={{ color: 'var(--primary)' }} />
    <p style={{ marginTop: '20px', color: 'var(--gray)' }}>Loading delicious recipes...</p>
  </div>
);