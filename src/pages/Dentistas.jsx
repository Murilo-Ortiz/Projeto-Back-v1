import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import Table from '../components/Table';
import Footer from '../components/Footer';
import styles from '../styles/pages/Dentistas.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchDentistas } from '../api/dentistas'; // Importando a função correta

function Dentistas() {
    const navigate = useNavigate();
    const [dentistas, setDentistas] = useState([]);

    useEffect(() => {
        const loadDentistas = async () => {
            try {
                const data = await fetchDentistas();
                setDentistas(data);
            } catch (error) {
                console.error('Erro ao buscar dentistas:', error);
            }
        };
        loadDentistas();
    }, []);

    const handleAddDentista = () => {
        navigate('/novo-dentista'); // Redireciona para a página de criação
    };

    const columns = [
        { key: 'nome', label: 'Nome' },
        { key: 'fone', label: 'Telefone' },
        { key: 'cpf', label: 'CPF' }, // Inclui CPF na tabela de dentistas
        { key: 'cro', label: 'CRO' }  // Inclui CRO na tabela de dentistas
    ];

    const buttons = [
        { type: 'add', text: 'Adicionar Novo Dentista', onClick: handleAddDentista }
    ];

    return (
        <Dashboard>
            <div className={styles.contentWrapper}>
                <Table data={dentistas} columns={columns} onRowClick={(id) => navigate(`/dentista/${id}`)} />
                <Footer buttons={buttons} />
            </div>
        </Dashboard>
    );
}

export default Dentistas;
