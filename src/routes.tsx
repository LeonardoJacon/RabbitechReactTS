import {createBrowserRouter} from 'react-router';
import {Listar} from './pages/Listagem';
import {Cadastrar} from './pages/Cadastro';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Listar />
  },
  {
    path: '/leads/criar',
    element: <Cadastrar />
  }
]);