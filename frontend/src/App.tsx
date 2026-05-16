import { Routes, Route, Navigate } from 'react-router-dom'

// Páginas — serão criadas nos próximos dias
// import Login from './pages/Login'
// import Cadastro from './pages/Cadastro'
// import Dashboard from './pages/Dashboard'

// Página temporária para confirmar que o setup está funcionando
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primaria-500 mb-4">
                🎯 Habit Tracker
              </h1>
              <p className="text-slate-400">
                Frontend configurado com sucesso!
              </p>
            </div>
          </div>
        }
      />
      {/* Rotas serão adicionadas nos próximos commits */}
    </Routes>
  )
}

export default App