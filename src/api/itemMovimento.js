import axios from 'axios';

const API_URL = '/api/itemMovimento';

// Função para obter um ItemMovimento pelo ID
export const fetchItemMovimentoById = (id) =>
    axios.get(`${API_URL}/${id}`).then(res => res.data);

// Função para criar um novo ItemMovimento
export const createItemMovimento = (itemMovimento) =>
    axios.post(API_URL, itemMovimento).then(res => res.data);

// Função para atualizar um ItemMovimento existente pelo ID
export const updateItemMovimento = (id, itemMovimento) =>
    axios.put(`${API_URL}/${id}`, itemMovimento).then(res => res.data);

// Função para deletar um ItemMovimento pelo ID
export const deleteItemMovimento = (id) =>
    axios.delete(`${API_URL}/${id}`);
