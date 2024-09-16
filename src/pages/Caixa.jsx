import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Caixa.module.css";
import Dashboard from "../components/Dashboard";
import Table from "../components/Table";
import Footer from "../components/Footer";
import { openCaixa, closeCaixa, fetchMovimentosByCaixaId, checkCaixaStatus } from "../api/caixa";

function Caixa() {
    const [movements, setMovements] = useState([]);
    const [caixaId, setCaixaId] = useState(null); // Armazena o ID do caixa
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            checkCaixaStatus(userId)
                .then(data => {
                    if (data && data.id) {
                        setCaixaId(data.id);
                        fetchMovimentosByCaixaId(data.id)
                            .then(movements => setMovements(movements))
                            .catch(error => console.error("Erro ao obter movimentos:", error));
                    }
                })
                .catch(error => console.error('Erro ao verificar status do caixa:', error));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleOpenCaixa = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const data = await openCaixa(userId);
                const caixaId = data.id;

                localStorage.setItem('caixaId', caixaId);
                setCaixaId(caixaId);
                console.log('Caixa aberto com sucesso');
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error('Erro ao abrir o caixa:', error.message);
        }
    };

    const handleCloseCaixa = async () => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            try {
                await closeCaixa(userId);
                setCaixaId(null);
                setMovements([]);
                console.log('Caixa fechado com sucesso');
            } catch (error) {
                console.error("Erro ao fechar o caixa:", error.message);
            }
        } else {
            console.warn('Não foi possível fechar o caixa. Verifique se o usuário está autenticado e o caixa está aberto.');
        }
    };

    const handleAddMovement = () => {
        navigate("/novo-movimento");
    };

    const handleRowClick = (id) => {
        navigate(`/novo-movimento/${id}`);
    };

    const columns = [
        { key: 'operacao', label: 'Operação' },
        { key: 'modalidade', label: 'Modalidade' },
        { key: 'valor', label: 'Valor' },
        { key: 'descricao', label: 'Descrição' },
        { key: 'dataHora', label: 'Data e Hora' }
    ];

    const footerButtons = [
        { text: "Adicionar", onClick: handleAddMovement, type: "add" },
        { text: "Fechar", onClick: handleCloseCaixa, type: "close" }
    ];

    return (
        <Dashboard>
            <div className={styles.contentWrapper}>
                {!caixaId && (
                    <button className={styles.openCaixaButton} onClick={handleOpenCaixa}>
                        Abrir Caixa
                    </button>
                )}
                {caixaId && (
                    <>
                        <Table data={movements} columns={columns} onRowClick={handleRowClick} />
                        <Footer buttons={footerButtons} />
                    </>
                )}
            </div>
        </Dashboard>
    );
}

export default Caixa;
