import { useState, useEffect } from 'react';
import { listLeads } from '../types/Lead';
import {useNavigate} from 'react-router';
import type {Lead} from '../types/Lead';

export function Listar() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [shownPage, setShownPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    setCarregando(true);
    setErro(null);
    listLeads(page, 10)
      .then((data) => {
        setLeads(data.items); 
        setTotalPages(data.totalPages);
        setShownPage(page);
      })
      .catch((error: Error) => {
        console.error('Erro ao listar leads :', error);
        setErro(error.message); 
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [page,attempt]);
const handleNextPage = (newPage: number) => {
    setPage(newPage);
    setAttempt((prev) => prev + 1);
};
  return (
    <div>
      <h1>Leads</h1>
        <button onClick={() => navigate ('/leads/criar')}>Criar Leads</button>
      {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Origem</th>
                <th>Status</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.nome}</td>
                  <td>{lead.email}</td>
                  <td>{lead.telefone}</td>
                  <td>{lead.origem}</td>
                  <td>{lead.status}</td>
                  <td>{new Date(lead.criadoEm).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button
              disabled={shownPage <= 1}
              onClick={() => handleNextPage(shownPage - 1)}
            >
              Anterior
            </button>
            <span style={{ margin: '0 1rem' }}>
              Página {shownPage} de {totalPages}
            </span>
            <button
              disabled={shownPage >= totalPages}
              onClick={() => handleNextPage(shownPage + 1)}
            >
              Próxima
            </button>
            <span style={{ marginLeft: '1rem' }}>
              <button onClick={() => handleNextPage(page)}>Tentar Novamente</button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
