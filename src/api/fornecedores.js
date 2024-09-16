import api from './api'; // Importe a instância do axios

const API_BASE_URL = '/api/fornecedor';

export const fetchFornecedores = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch fornecedores');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        throw error; // Repassa o erro para o chamador
    }
};

export const fetchFornecedorById = async (id) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch fornecedor');
        }
        return response.data; // `response.data` contém o JSON retornado
    } catch (error) {
        console.error('Erro ao buscar fornecedor:', error);
        throw error; // Repassa o erro para o chamador
    }
};

export const createFornecedor = async (fornecedor) => {
    try {
        const response = await api.post(`${API_BASE_URL}`, fornecedor, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 201) {
            throw new Error('Failed to create fornecedor');
        }
        return response.data; // `response.data` pode não ser necessário aqui, já que apenas a URI é retornada
    } catch (error) {
        console.error('Erro ao criar fornecedor:', error);
        throw error; // Repassa o erro para o chamador
    }
};

export const updateFornecedor = async (id, fornecedor) => {
    try {
        const response = await api.put(`${API_BASE_URL}/${id}`, fornecedor, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 204) { // No Content (204) indica sucesso
            throw new Error('Failed to update fornecedor');
        }
        return response.data; // `response.data` pode não ser necessário aqui
    } catch (error) {
        console.error('Erro ao atualizar fornecedor:', error);
        throw error; // Repassa o erro para o chamador
    }
};

export const deleteFornecedor = async (id) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/${id}`);
        if (response.status !== 204) { // No Content (204) indica sucesso
            throw new Error('Failed to delete fornecedor');
        }
        return response.data; // `response.data` pode não ser necessário aqui
    } catch (error) {
        console.error('Erro ao deletar fornecedor:', error);
        throw error; // Repassa o erro para o chamador
    }
};
