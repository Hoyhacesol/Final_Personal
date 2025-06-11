import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import './App.css';

function App() {
  return (
    <RouterProvider router={root}></RouterProvider>
  );
}

export default App;