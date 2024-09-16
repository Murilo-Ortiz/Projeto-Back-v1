// src/api/user.js

import api from './api'; // Certifique-se de que o caminho para o arquivo api.js está correto
const API_BASE_URL = 'api/usuario';

export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/usuario/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/usuario', userData);
        return response;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/usuario/${userId}`, userData);
        return response;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/usuario/${userId}`);
        return response;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        throw error;
    }
};

export const fetchUserIdByUsername = async (username) => {
    try {
        const response = await api.get(`${API_BASE_URL}/username`, {params: {username}});
        if (response.status !== 200) {
            throw new Error('Failed to fetch user ID');
        }
        return response.data; // `response.data` contém o userId
    } catch (error) {
        console.error(error);
        throw error; // Repassa o erro para o chamador
    }
};
