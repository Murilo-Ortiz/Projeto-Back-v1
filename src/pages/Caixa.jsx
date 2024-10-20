import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/pages/Caixa.module.css";
import Dashboard from "../components/Dashboard";
import Table from "../components/Table";
import Footer from "../components/Footer";
import { openCaixa, closeCaixa, fetchMovimentosByCaixaId, checkCaixaStatus } from "../api/caixa";

function Caixa() {
    const [movements, setMovements] = useState([]);
    const [caixaId, setCaixaId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            checkCaixaStatus(userId)
                .then(data => {
                    if (data && data.id) {
                        setCaixaId(data.id);
                        fetchMovimentosByCaixaId(data.id)
                            .then(movements => setMovements(formatData(movements)))
                            .catch(error => console.error("Erro ao obter movimentos:", error));
                    }
                })
                .catch(error => console.error('Erro ao verificar status do caixa:', error));

        } else {
            navigate("/login");
        }
    }, [navigate]);

    const formatData = (data) => {
        console.log(data);
        return data.map(item => ({
            ...item,
            fornecedor: item.fornecedor ? item.fornecedor.nome : 'Nenhum',
            dentista: item.dentista ? item.dentista.nome : 'Nenhum',
            valor: item.valor ? item.valor.toFixed(2) : '0.00',
            dataHora: item.dataHoraMovimento ? new Date(item.dataHoraMovimento).toISOString().slice(0, 16) : 'Data não disponível',
            tipo: item.receita ? item.receita.descricao : (item.despesa ? item.despesa.descricao : 'Nenhum')
        }));
    };



    const handleOpenCaixa = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const data = await openCaixa(userId);
                const caixaId = data.id;

                localStorage.setItem('caixaId', caixaId);
                setCaixaId(caixaId);
                console.log('Caixa aberto com sucesso:', caixaId);
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error('Erro ao abrir o caixa:', error.message);
            alert('Erro ao abrir o caixa. Tente novamente mais tarde.');
        }
    };

    const handleCloseCaixa = async () => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            try {
                // Fechar o caixa
                await closeCaixa(userId);
                console.log('Caixa fechado com sucesso');

                // Limpar estado e localStorage
                setCaixaId(null);
                setMovements([]);
                localStorage.removeItem('caixaId');
            } catch (error) {
                console.error("Erro ao fechar o caixa:", error.message);
                alert('Erro ao fechar o caixa. Tente novamente mais tarde.');
            }
        } else {
            console.warn('Não foi possível fechar o caixa. Verifique se o usuário está autenticado e o caixa está aberto.');
            alert('Não foi possível fechar o caixa. Verifique se o usuário está autenticado.');
        }
    };

    const handleAddMovement = () => {
        navigate("/novo-movimento");
    };


    const columns = [
        { key: 'operacao', label: 'Operação' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'modalidade', label: 'Modalidade' },
        { key: 'fornecedor', label: 'Fornecedor' },
        { key: 'dentista', label: 'Dentista' },
        { key: 'valor', label: 'Valor' },
        { key: 'dataHora', label: 'Data/Hora' }
    ];

    const footerButtons = [
        { text: "Adicionar", onClick: handleAddMovement, type: "add" },
        { text: "Fechar", onClick: handleCloseCaixa, type: "close" }
    ];

    return (
        <Dashboard>
            <div className={styles.mainContent}>
                {!caixaId ? (
                    <div className={styles.contentWrapper}>
                        <button className={styles.openCaixaButton} onClick={handleOpenCaixa}>
                            Abrir Caixa
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.tableWrapper}>
                            <Table data={movements} columns={columns} />
                        </div>
                        <div className={styles.footerWrapper}>
                            <Footer buttons={footerButtons} />
                        </div>
                    </>
                )}
            </div>
        </Dashboard>
    );
}

export default Caixa;