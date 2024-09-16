import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Table from '../components/Table';
import Footer from '../components/Footer';
import styles from '../styles/pages/Fornecedores.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchFornecedores } from '../api/fornecedores'; // Importando a função correta

function Fornecedores() {
    const navigate = useNavigate();
    const [fornecedores, setFornecedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFornecedores = async () => {
            try {
                const data = await fetchFornecedores();
                setFornecedores(data);
            } catch (err) {
                setError('Erro ao carregar fornecedores');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFornecedores();
    }, []);

    const handleAddFornecedor = () => {
        navigate('/novo-fornecedor'); // Redireciona para a página de criação
    };

    const columns = [
        { key: 'nome', label: 'Nome' },
        { key: 'fone', label: 'Telefone' },
        { key: 'endereco', label: 'Endereço' }
    ];

    const buttons = [
        { type: 'add', text: 'Adicionar Novo Fornecedor', onClick: handleAddFornecedor }
    ];

    return (
        <Dashboard>
            <div className={styles.contentWrapper}>
                {loading && <p>Carregando...</p>}
                {error && <p>{error}</p>}
                <Table
                    data={fornecedores}
                    columns={columns}
                    onRowClick={(id) => navigate(`/fornecedor/${id}`)}
                />
                <Footer buttons={buttons} />
            </div>
        </Dashboard>
    );
}

export default Fornecedores;
