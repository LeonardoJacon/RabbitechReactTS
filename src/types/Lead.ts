export const LEAD_STATUS = {
    NOVO: 'Novo',
    EM_CONTATO: 'Em contato',
    CONVERTIDO: 'Convertido'
} as const;
export const LEAD_ORIGINS = {
    SITE: 'Site',
    INDICACAO: 'Indicação',
    EVENTO: 'Evento'
} as const;
export interface LeadUser {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    origem: typeof LEAD_ORIGINS[keyof typeof LEAD_ORIGINS];
    status?: typeof LEAD_STATUS[keyof typeof LEAD_STATUS][];
    criadoEm: string;
}
export interface ErroApi {
    error:
    {
    code: string, 
    message: string
}};
export interface LeadPage {
    data:
    {
    items: LeadUser[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    }
}
export async function listLeads(page: number = 1, limit: number = 10): Promise<LeadPage['data']> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await fetch(`http://localhost:3001/leads?${params.toString()}`, );
    if (!response.ok) {
        const errorData: ErroApi = await response.json().catch(() => 
        ({error:{code: String(response.status),
        message: response.statusText || 'Erro desconhecido'}
    }
));
        throw new Error(errorData.error?.message || 'Erro desconhecido');
    }
    const Data: LeadPage = await response.json();
    return Data.data;
}
export async function createLead(lead: Omit<LeadUser, 'id' | 'criadoEm'>): Promise<LeadUser> {
const response = await fetch('http://localhost:3001/leads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
    });
    if (!response.ok){
        const errorData: ErroApi = await response.json().catch(() =>
        ({error:{code: String(response.status),
        message: response.statusText || 'Erro desconhecido'}}));
        throw new Error(errorData.error?.message || 'Erro desconhecido');
    }
    const createdLead: LeadUser = await response.json();
    return createdLead;
}