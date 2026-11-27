    import type {Lead} from '../types/Lead';
    import {LEAD_ORIGINS, LEAD_STATUS, createLead} from '../types/Lead';
    import { useState } from 'react';
    import { useNavigate } from 'react-router'
    type CampoTexto = 'nome' | 'email' | 'telefone'; // Campos de texto do formulário   
    const telefoneformat = (v: string) => {
    return v
        .replace(/\D/g, '')
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    };
    const validations: Record<CampoTexto, (v: string) => string> = { // Adicionando validações para os campos do formulário
        nome: (v) =>{ 
        const nome = v.trim();
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (nome.length < 3) {
            return 'Nome inválido. Deve conter ao menos 3 caracteres.';
        }
        if (!nomeRegex.test(v)){
            return 'Apenas letras.'
        }
        return '';
        },
        email: (v) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(v)) {
            return 'E-mail inválido.';
        }
        return '';
        },
        telefone: (v) => {
        const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!telefoneRegex.test(v)) {
            return 'Telefone inválido.';
        }
        return '';
        }
    };
    export function Cadastrar() {
        const navigate = useNavigate();
        type LeadOrigin = Lead['origem']; // Tipo para a origem do lead
        type LeadStatus = Lead['status']; // Tipo para o status do lead
        type LeadForm = Omit<Lead, 'id' | 'criadoEm' | 'status' | 'origem'> & {
            origem: LeadOrigin | '';
            status: LeadStatus | '';
        }; // Tipo para o formulário de lead 
        const empty: LeadForm = {
            nome: '',
            email: '',
            telefone: '',
            origem: '',
            status: ''
        }; // Estado inicial do formulário 
        const [form,setForm] = useState<LeadForm>(empty);
        const [errors, setErrors] = useState<Partial<Record<CampoTexto, string>>>({});
        const [touched, setTouched] = useState<Partial<Record<CampoTexto, boolean>>>({});
        const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => { // Função para lidar com mudanças nos campos do formulário
            const value = e.target.value;
            const formattedValue = field === 'telefone' ? telefoneformat(value) : value
            setForm((prev) => ({...prev, [field]: formattedValue}));
            if (touched[field as keyof typeof touched]) {
                const error = validations[field as CampoTexto]?.(formattedValue);
                setErrors((prev) => ({ ...prev, [field]: error }));
            }
        };
        const onBlur = (field: string) => () => { // Função para lidar com o evento de perda de foco nos campos do formulário
            setTouched((prev) => ({ ...prev, [field]: true }));
            const error = validations[field as CampoTexto]?.(form[field as keyof LeadForm] as string);
            setErrors((prev) => ({ ...prev, [field]: error }));
        }
        const CAMPOS_TEXTO: { nome: CampoTexto; label: string; placeholder: string; type: string }[] = [
        { nome: 'nome', label: 'Nome Completo', placeholder: 'Ex: Leonardo Jacon', type: 'text' },
        { nome: 'email', label: 'E-mail', placeholder: 'Ex: LeonardoJacon@email.com', type: 'email' },
        { nome: 'telefone', label: 'Telefone', placeholder: 'Ex: (11) 99999-9999', type: 'text' }
    ];
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            const novosErros: Partial<Record<CampoTexto, string >> = {
                nome: validations.nome(form.nome),
                email: validations.email(form.email),
                telefone: validations.telefone(form.telefone)

            };
            setErrors(novosErros);
            setTouched({nome: true, email: true, telefone: true});
            if (Object.values(novosErros).some((error) => error)){
                alert('Corrija os erros antes de enviar.');
                return;
            }
            if (!form.origem || !form.status){
                alert('Preencha os campos.')
                return;
            }
            try{
                await createLead({...form, origem: form.origem, status:form.status});
                alert('Cadastro Realizado!');
                setForm(empty);
                setErrors({});
                setTouched({});
            }
            catch (err){
                alert(err instanceof Error ? err.message : 'Erro inesperado.');
            }
        } // Função para lidar com o envio do formulário
        return (
            <>
            <button onClick={() => navigate ('/')}>Listar leads</button>
            <h1>Cadastrar Lead</h1>
            <form onSubmit={handleSubmit}>
            {CAMPOS_TEXTO.map(({nome,label,placeholder,type}) => (
                    <div key={nome}>
                        <label>{label}</label>
                        <input
                            type={type}
                            placeholder={placeholder}
                            value={form[nome as keyof typeof form]}
                            onChange={handleChange(nome)}
                            onBlur={onBlur(nome)}
                        />
                        {touched[nome as keyof typeof touched] && errors[nome as keyof typeof errors] && (
                            <span style={{ color: 'red' }}>{errors[nome as keyof typeof errors]}</span>
                        )}
                    </div>
                ))}
                <div>
                    <label htmlFor='Origem'>Origem</label>
                    <select value={form.origem} onChange={(e) => {
                        setForm({ ...form, origem: e.target.value as LeadOrigin })}}>
                    <option value = "" disabled>Selecione a origem</option>
                    {Object.values(LEAD_ORIGINS).map((origem) => (
                        <option key = {origem} value = {origem}>{origem}</option>
                        ))}
                    </select>
                    <label htmlFor='Status'>Status</label>
                    <select value={form.status} onChange={(e) => {
                        setForm({ ...form, status: e.target.value as LeadStatus })}}>
                        <option value = "" disabled>Selecione o status</option>
                        {Object.values(LEAD_STATUS).map((status) => (
                            <option key = {status} value = {status}>{status}</option>
                        ))}
                    </select>
                <button type='submit'>Cadastrar</button>
                </div>
            </form>
            </>
        )
    }