import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth_Screens/Login';
import Signup from './Pages/Auth_Screens/Signup';
import Main from './Pages/Main_screen/Main'
import { AuthProvider } from './Context/AthContext';
import { UserProvider } from './Context/UserContext';
import { StoryProvider } from './Context/StoryContext';
import Profile from './Pages/Profile/Profile';
import PostForm from './Components/PostFrom/PostForm';
import MainChat from './Pages/Chat_screen/Chat_main';
import Followers from './Pages/Conn_Screens/Conn_screen';
import ProtectedRoute from './Context/Protected_Route';
import Std from './Components/Story/StorySection';
import { PostProvider } from './Context/PostContext';
import { ChatProvider } from './Context/ChatContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import NotificationsPage from './Pages/Notify_Screen/Notify_Screen';
import { toast, Toaster } from "react-hot-toast";
import { Navigate } from 'react-router-dom';

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <UserProvider>
        <ChatProvider>
        <StoryProvider>
        <PostProvider>
        <Toaster />
          <Routes>
       
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
     
            <Route element={<ProtectedRoute />}>

              <Route path="/main" element={<Main/>} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path='/chat'  element={<MainChat/>}/>
               <Route path='/not'  element={<NotificationsPage/>}/>
               <Route path='/fol'  element={<Followers/>}/>
               
            </Route>
            
          
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
   
          </PostProvider>
          </StoryProvider>
          </ChatProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
