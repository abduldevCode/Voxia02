import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AthContext';
import LoadingScreen from '../Components/LoadingScreen/LoadingScreen';
const ProtectedRoute = () => {
  const { isAuthenticated, isloading } = useContext(AuthContext);

  if (isloading) {
    return <LoadingScreen/>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
