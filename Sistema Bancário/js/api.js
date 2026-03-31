const URL = 'http://localhost:3000';

export const api = {
    get: async (endpoint) => {
        // Bloqueia o cache para forçar a busca de dados novos
        const res = await fetch(`${URL}/${endpoint}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Erro ao buscar ${endpoint}`);
        return res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetch(`${URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Erro ao criar em ${endpoint}`);
        return res.json();
    },
    put: async (endpoint, id, data) => {
        const res = await fetch(`${URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Erro ao atualizar ${endpoint}`);
        return res.json();
    },
    delete: async (endpoint, id) => {
        const res = await fetch(`${URL}/${endpoint}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Erro ao deletar em ${endpoint}`);
    }
};