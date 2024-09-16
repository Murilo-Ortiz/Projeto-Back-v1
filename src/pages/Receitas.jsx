import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Table from '../components/Table';
import Footer from '../components/Footer';
import styles from '../styles/pages/Receitas.module.css';
import { fetchTipoReceitas, deleteTipoReceita } from '../api/tipoReceita';

// Função de formatação para descrição
const formatDescricao = (descricao) => {
    return descricao
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

function TipoReceitas() {
    const [tipoReceitas, setTipoReceitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTipoReceitas = async () => {
            try {
                const data = await fetchTipoReceitas();
                // Formatar descrição antes de definir o estado
                const formattedData = data.map(tipo => ({
                    ...tipo,
                    descricao: formatDescricao(tipo.descricao)
                }));
                setTipoReceitas(formattedData);
            } catch (error) {
                setError('Erro ao carregar tipos de receita');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTipoReceitas();
    }, []);

    const handleAddTipoReceita = () => {
        navigate('/novo-tipo-receita');
    };

    const handleRowClick = (id) => {
        navigate(`/tipo-receita/${id}`);
    };

    const handleDeleteTipoReceita = async (id) => {
        try {
            await deleteTipoReceita(id);
            setTipoReceitas(tipoReceitas.filter(tipo => tipo.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tipo de receita:', error);
        }
    };

    const columns = [
        { key: 'descricao', label: 'Descrição' }
    ];

    const buttons = [
        { type: 'add', text: 'Adicionar Novo Tipo de Receita', onClick: handleAddTipoReceita }
    ];

    return (
        <Dashboard>
            <div className={styles.contentWrapper}>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                <Table
                    data={tipoReceitas}
                    columns={columns}
                    onRowClick={handleRowClick}
                    onDelete={handleDeleteTipoReceita}
                />
                <Footer buttons={buttons} />
            </div>
        </Dashboard>
    );
}

export default TipoReceitas;
