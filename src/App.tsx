import { useState, useEffect } from 'react';
import { listLeads } from './types/Lead';
import type {LeadUser} from './types/Lead';

function App() {
  const [leads, setLeads] = useState<LeadUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [shownPage, setShownPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [attemptedPage, setAttemptedPage] = useState(1);
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
    setAttemptedPage(newPage);
};
  return (
    <div>
      <h1>Leads</h1>

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
                  <td>{String(lead.origem)}</td>
                  <td>{lead.status ? String(lead.status) : '-'}</td>
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
              <button onClick={() => handleNextPage(attemptedPage)}>Tentar Novamente</button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default App
