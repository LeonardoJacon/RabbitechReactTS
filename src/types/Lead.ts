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
export interface Lead {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    origem: typeof LEAD_ORIGINS[keyof typeof LEAD_ORIGINS];
    status: typeof LEAD_STATUS[keyof typeof LEAD_STATUS];
    criadoEm: string;
}
export interface LeadUser{
    data:Lead;
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
    items: Lead[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    }
}
async function request<T>(url: string, options?:RequestInit): Promise<T>{
    let response: Response;
    try{
        response = await fetch (url,options);
    } catch{
        throw new Error ("Não foi possível acessar o servidor.")
    }
    if (!response.ok){
        const errorBody = await response.json().catch(() => ({error:{code: String(response.status), message: response.statusText || "Erro desconhecido."}}));
        throw new Error (errorBody?.error?.message || 'Erro desconhecido.')
    }
    return response.json();
}
export async function listLeads(page: number = 1, limit: number = 10): Promise<LeadPage['data']> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    const response = await request<LeadPage>(`http://localhost:3001/leads?${params.toString()}`)
    const data: LeadPage = await response ;
    return data.data;
}
export async function createLead(payload: Omit<Lead, 'id' | 'criadoEm'>) : Promise<LeadUser['data']> {
const response = await request<LeadUser>('http://localhost:3001/leads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    })
    const createdLead: LeadUser = await response;
    return createdLead.data;
}