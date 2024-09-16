import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Table from '../components/Table';
import Footer from '../components/Footer';
import styles from '../styles/pages/Despesas.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchTipoDespesas } from '../api/tipoDespesa';

function TipoDespesas() {
    const [tipoDespesas, setTipoDespesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTipoDespesas = async () => {
            try {
                const data = await fetchTipoDespesas();
                setTipoDespesas(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        loadTipoDespesas();
    }, []);

    const handleAddTipoDespesa = () => {
        navigate('/novo-tipo-despesa'); // Redireciona para a página de criação
    };

    const columns = [
        { key: 'descricao', label: 'Descrição' },
    ];

    const buttons = [
        { type: 'add', text: 'Adicionar Novo Tipo de Despesa', onClick: handleAddTipoDespesa }
    ];

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Dashboard>
            <div className={styles.contentWrapper}>
                <Table
                    data={tipoDespesas}
                    columns={columns}
                    onRowClick={(id) => navigate(`/tipo-despesa/${id}`)}
                    usePagination={true} // Ou altere para `false` se desejar usar rolagem
                />
                <Footer buttons={buttons} />
            </div>
        </Dashboard>
    );
}

export default TipoDespesas;
