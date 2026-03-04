import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginSignupPage } from './pages/login-signup';
import { HomePage } from './pages/home/index';
import { ProtectedRoute } from './components/routeProtection';
import { AuthProvider } from '../context/authContext';




const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <LoginSignupPage />
      },
    
      {
        path: "/home",
        element: (
          //<ProtectedRoute>
            <HomePage />
          //</ProtectedRoute>
        ),
      },
    ]
  }
]);

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

