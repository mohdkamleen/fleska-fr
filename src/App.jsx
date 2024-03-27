import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Orders from './pages/Orders';

function App() {
  return ( 
    <BrowserRouter>
    <Routes> 
            <Route path="" element={<Home />} />
            <Route path="auth" element={<Auth />} /> 
            <Route path="orders" element={<Orders />} /> 
    </Routes>
</BrowserRouter >
  );
}

export default App;
