import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { DemandPage } from './pages/DemandPage';
import { SupplyPage } from './pages/SupplyPage';
import { BOMPage } from './pages/BOMPage';
import { WorkOrderPage } from './pages/WorkOrderPage';

export function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8 h-16 items-center">
            <NavLink
              to="/demand"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Demand
            </NavLink>
            <NavLink
              to="/supply"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Supply
            </NavLink>
            <NavLink
              to="/bom"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Bill of Materials
            </NavLink>
            <NavLink
              to="/workorder"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              Work Orders
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/demand" element={<DemandPage />} />
          <Route path="/supply" element={<SupplyPage />} />
          <Route path="/bom" element={<BOMPage />} />
          <Route path="/workorder" element={<WorkOrderPage />} />
          <Route path="/" element={<DemandPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;