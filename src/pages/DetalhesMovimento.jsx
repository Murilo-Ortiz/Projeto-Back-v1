// src/pages/DetalhesMovimento.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/pages/DetalhesMovimento.module.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function DetalhesMovimento() {
    const { id } = useParams(); // Obtém o ID do movimento da URL
    const [movimento, setMovimento] = useState(null);

    useEffect(() => {
        // Simulação de dados
        const simulatedMovimentos = [
            { id: 1, operacao: "Aporte", modalidade: "Dinheiro", valor: 100.00, descricao: "Aporte inicial", dataHora: "2024-09-09T10:00:00" },
            { id: 2, operacao: "Receita", modalidade: "Cartão", valor: 200.00, descricao: "Venda de serviço", dataHora: "2024-09-09T11:00:00" },
            { id: 3, operacao: "Despesa", modalidade: "Pix", valor: 50.00, descricao: "Compra de material", dataHora: "2024-09-09T12:00:00" },
        ];

        // Busca o movimento com base no ID
        const movimentoEncontrado = simulatedMovimentos.find(m => m.id === parseInt(id));
        setMovimento(movimentoEncontrado);
    }, [id]);

    return (
        <main className={styles.detalhesMovimento}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header />
                <div className={styles.contentWrapper}>
                    {movimento ? (
                        <div className={styles.detailsContainer}>
                            <h2>Detalhes do Movimento</h2>
                            <p><strong>Operação:</strong> {movimento.operacao}</p>
                            <p><strong>Modalidade:</strong> {movimento.modalidade}</p>
                            <p><strong>Valor:</strong> {movimento.valor.toFixed(2)}</p>
                            <p><strong>Descrição:</strong> {movimento.descricao}</p>
                            <p><strong>Data e Hora:</strong> {new Date(movimento.dataHora).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p>Movimento não encontrado.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default DetalhesMovimento;
