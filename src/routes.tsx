import {createBrowserRouter} from 'react-router';
import {Listar} from './pages/Listagem';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Listar />
  },
  {
    path: '/leads/criar',
    element: <h1>Criar Leads a ser implementado</h1>
  }
]);