import api from './api'; // Importe a instância do axios

const API_BASE_URL = 'api/receita';

// Função para obter todos os tipos de receita
export const fetchTipoReceitas = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch tipos de receita');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para obter um tipo de receita pelo ID
export const fetchTipoReceitaById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch tipo de receita');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para criar um novo tipo de receita
export const createTipoReceita = async (tipoReceita) => {
    try {
        const response = await api.post(`${API_BASE_URL}`, tipoReceita, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            throw new Error('Failed to create tipo de receita');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para atualizar um tipo de receita
export const updateTipoReceita = async (id, tipoReceita) => {
    try {
        const response = await api.put(`${API_BASE_URL}/${id}`, tipoReceita, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 200) {
            throw new Error('Failed to update tipo de receita');
        }
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para deletar um tipo de receita
export const deleteTipoReceita = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete tipo de receita');
        }
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};
