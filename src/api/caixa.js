import api from './api'; // Importe a instância do axios

const API_BASE_URL = '/api/caixa'; // URL base para a API de caixa

// Função para abrir o caixa
export const openCaixa = async (userId) => {
    try {
        const response = await api.post(`${API_BASE_URL}/${userId}`);
        if (response.status === 201) {
            return response.data; // Retorna os dados do caixa (incluindo o ID)
        } else {
            throw new Error('Failed to open caixa');
        }
    } catch (error) {
        console.error('Error opening caixa:', error);
        throw error;
    }
};

// Função para fechar o caixa
export const closeCaixa = async (userId) => {
    try {
        const response = await api.put(`${API_BASE_URL}/${userId}`);
        if (response.status === 204) {
            return;
        } else {
            throw new Error('Failed to close caixa');
        }
    } catch (error) {
        console.error('Error closing caixa:', error);
        throw error;
    }
};

// Função para verificar o status do caixa
export const checkCaixaStatus = async (userId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${userId}`);
        if (response.status === 200) {
            return response.data; // Retorna os dados do caixa, se encontrado
        } else {
            return null; // Retorna que o caixa não está aberto
        }
    } catch (error) {
        console.error('Error checking caixa status:', error);
        throw error;
    }
};

// Função para obter os movimentos pelo ID do caixa
export const fetchMovimentosByCaixaId = async (caixaId) => {
    try {
        const response = await api.get(`${API_BASE_URL}/${caixaId}/movimentos`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch movements');
        }
    } catch (error) {
        console.error('Error fetching movements:', error);
        throw error;
    }
};

// Função para adicionar um movimento
export const addMovimento = async (caixaId, movimento) => {
    try {
        const dataHora = new Date(movimento.dataHora);
        if (isNaN(dataHora.getTime())) {
            throw new Error('Data e hora inválidos');
        }

        const payload = {
            operacao: movimento.operacao,
            modalidade: movimento.modalidade,
            valor: movimento.valor,
            dataHoraMovimento: dataHora.toISOString(),
            taxa: movimento.taxa || null,
            dentista: movimento.dentista || null,
            fornecedor: movimento.fornecedor || null,
            tipoReceita: movimento.tipoReceita || null,
            tipoDespesa: movimento.tipoDespesa || null
        };

        const response = await api.post(`${API_BASE_URL}/${caixaId}/movimentos`, payload);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar movimento:', error.response?.data || error.message);
        throw error;
    }
};

// Atualizar movimento existente
export const updateMovimento = async (caixaId, id, movimento) => {
    try {
        const response = await api.put(`${API_BASE_URL}/${caixaId}/movimentos/${id}`, movimento);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar movimento:', error.response?.data || error.message);
        throw error;
    }
};

// Deletar movimento
export const deleteMovimento = async (caixaId, id) => {
    try {
        await api.delete(`${API_BASE_URL}/${caixaId}/movimentos/${id}`);
    } catch (error) {
        console.error('Erro ao deletar movimento:', error.response?.data || error.message);
        throw error;
    }
};

export const downloadRelatorioCaixas = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/caixas`, {
            responseType: 'blob' // Para lidar com arquivos binários
        });

        // Cria um URL para o blob e retorna
        const url = window.URL.createObjectURL(new Blob([response.data]));
        return url;
    } catch (error) {
        console.error('Erro ao gerar o relatório:', error);
        throw error;
    }
};
