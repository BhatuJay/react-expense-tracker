import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './pages/ProtectedRoute';
import { RootLayout } from './components/RootLayout';
import { Home } from './pages/Home'
import { Register } from './pages/Register';
import { Login } from './pages/Login';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><RootLayout /></ProtectedRoute>,
    children: [
      {
        path: "/",
        element: <Home />
      }
    ]
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  }
])

function App() {
  return <RouterProvider router={routes} />
}

export default App