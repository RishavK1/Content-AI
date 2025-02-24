import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import Caption from './pages/generate/Caption';
import Video from './pages/generate/Video';
import Image from './pages/generate/Image';
import Trending from './pages/trending/Trending';
import SavedContent from './pages/saved/SavedContent';
import { useAuthStore } from './store/auth';

function App() {
  const checkUser = useAuthStore((state) => state.checkUser);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signin"
          element={user ? <Navigate to="/dashboard" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/signin" />}
        />
        <Route
          path="/generate/caption"
          element={user ? <Caption /> : <Navigate to="/signin" />}
        />
        <Route
          path="/generate/video"
          element={user ? <Video /> : <Navigate to="/signin" />}
        />
        <Route
          path="/generate/image"
          element={user ? <Image /> : <Navigate to="/signin" />}
        />
        <Route
          path="/trending"
          element={user ? <Trending /> : <Navigate to="/signin" />}
        />
        <Route
          path="/saved"
          element={user ? <SavedContent /> : <Navigate to="/signin" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/signin"} />}
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;