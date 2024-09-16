import api from './api'; // Importe a instância do axios

const API_BASE_URL = 'api/despesa';

// Função para obter todos os tipos de despesa
export const fetchTipoDespesas = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch tipos de despesa');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para obter um tipo de despesa pelo ID
export const fetchTipoDespesaById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch tipo de despesa');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para criar um novo tipo de despesa
export const createTipoDespesa = async (tipoDespesa) => {
    try {
        const response = await api.post(`${API_BASE_URL}`, tipoDespesa, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            throw new Error('Failed to create tipo de despesa');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para atualizar um tipo de despesa
export const updateTipoDespesa = async (id, tipoDespesa) => {
    try {
        const response = await api.put(`${API_BASE_URL}/${id}`, tipoDespesa, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 200) {
            throw new Error('Failed to update tipo de despesa');
        }
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};

// Função para deletar um tipo de despesa
export const deleteTipoDespesa = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete tipo de despesa');
        }
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};
