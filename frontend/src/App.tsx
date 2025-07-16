import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import Watch from './pages/Watch';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import MovieDetails from './components/MovieDetails';
import CategoryPage from './components/CategoryPage';
import SearchResults from './pages/SearchResults';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Success from './pages/Success';





function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <div>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/movies" element={<CategoryPage />} />
<Route path="/series" element={<CategoryPage />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/movie/:id" element={
                    <ProtectedRoute>
                      <MovieDetails />
                    </ProtectedRoute>
                  } />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
<Route path="/success" element={<Success />} />

<Route path="/search" element={
  <ProtectedRoute>
    <SearchResults />
  </ProtectedRoute>
} />

                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/watch/:id" element={
                    <ProtectedRoute requireSubscription>
                      <Watch />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  } />
                </Routes>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;