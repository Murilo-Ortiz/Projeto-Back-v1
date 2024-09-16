import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import styles from '../styles/pages/NovoMovimento.module.css';
import { fetchDentistas } from '../api/dentistas';
import { fetchFornecedores } from '../api/fornecedores';
import { fetchTipoReceitas } from '../api/tipoReceita';
import { fetchTipoDespesas } from '../api/tipoDespesa';
import {
    addMovimento,
    updateMovimento,
    deleteMovimento,
    fetchMovimentosByCaixaId, checkCaixaStatus
} from '../api/caixa';

function NovoMovimento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movimento, setMovimento] = useState({
        operacao: '',
        modalidade: 'Dinheiro',
        valor: '',
        descricao: '',
        dataHora: new Date().toISOString().slice(0, 16),
        taxa: 5,
        dentista: '',
        fornecedor: '',
        tipoReceita: '',
        tipoDespesa: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [dentistas, setDentistas] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [tipoReceitas, setTipoReceitas] = useState([]);
    const [tipoDespesas, setTipoDespesas] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const caixaId = checkCaixaStatus(userId);
                if (!caixaId) {
                    console.error('Caixa não encontrado no localStorage');
                    navigate('/caixa'); // Redireciona se o caixaId não estiver disponível
                    return;
                }

                const [dentistasData, fornecedoresData, tipoReceitasData, tipoDespesasData] = await Promise.all([
                    fetchDentistas(),
                    fetchFornecedores(),
                    fetchTipoReceitas(),
                    fetchTipoDespesas()
                ]);

                setDentistas(dentistasData);
                setFornecedores(fornecedoresData);
                setTipoReceitas(tipoReceitasData);
                setTipoDespesas(tipoDespesasData);

                if (id) {
                    const movimentoData = await fetchMovimentosByCaixaId(caixaId);
                    const movimentoToEdit = movimentoData.find(m => m.id === parseInt(id));
                    setMovimento(movimentoToEdit || {});
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };

        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovimento((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const caixaId = localStorage.getItem(`caixaId`); // Obtém o caixaId do localStorage
            if (!caixaId) {
                console.error('Caixa não encontrado no localStorage');
                return;
            }
            if (isEditing) {
                await updateMovimento(caixaId, id, movimento);
            } else {
                await addMovimento(caixaId, movimento);
            }
            navigate('/caixa');
        } catch (error) {
            console.error('Erro ao salvar movimento:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const caixaId = localStorage.getItem(`caixaId`); // Obtém o caixaId do localStorage
            if (!caixaId) {
                console.error('Caixa não encontrado no localStorage');
                return;
            }
            await deleteMovimento(caixaId, id);
            navigate('/caixa');
        } catch (error) {
            console.error('Erro ao excluir movimento:', error);
        }
    };

    const handleCancel = () => {
        navigate('/caixa');
    };

    const buttons = [
        { type: 'save', text: 'Salvar', onClick: handleSave },
        { type: 'cancel', text: 'Voltar', onClick: handleCancel }
    ];

    if (isEditing) {
        buttons.push({ type: 'delete', text: 'Excluir', onClick: handleDelete });
    }

    return (
        <Dashboard>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>{isEditing ? 'Editar Movimento' : 'Adicionar Novo Movimento'}</h1>
                <form className={styles.form}>
                    <div className={styles.operationAndDate}>
                        <div className={styles.formGroupHalf}>
                            <label htmlFor="operacao">Operação</label>
                            <select
                                id="operacao"
                                name="operacao"
                                value={movimento.operacao}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.value === 'Sangria' || e.target.value === 'Aporte') {
                                        setMovimento(prev => ({ ...prev, modalidade: 'Dinheiro' }));
                                    }
                                }}
                            >
                                <option value="">Selecione</option>
                                <option value="Aporte">Aporte</option>
                                <option value="Sangria">Sangria</option>
                                <option value="Receita">Receita</option>
                                <option value="Despesa">Despesa</option>
                            </select>
                        </div>
                        <div className={styles.formGroupHalf}>
                            <label htmlFor="dataHora">Data e Hora</label>
                            <input
                                id="dataHora"
                                name="dataHora"
                                type="datetime-local"
                                value={movimento.dataHora}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                    </div>
                    {movimento.operacao === 'Receita' && (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="tipoReceita">Tipo de Receita</label>
                                <select
                                    id="tipoReceita"
                                    name="tipoReceita"
                                    value={movimento.tipoReceita}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione o Tipo de Receita</option>
                                    {tipoReceitas.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="dentista">Dentista</label>
                                <select
                                    id="dentista"
                                    name="dentista"
                                    value={movimento.dentista}
                                    onChange={handleChange}
                                >
                                    <option value="">Nenhum Dentista</option>
                                    {dentistas.map((dentista) => (
                                        <option key={dentista.id} value={dentista.id}>
                                            {dentista.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    {movimento.operacao === 'Despesa' && (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="tipoDespesa">Tipo de Despesa</label>
                                <select
                                    id="tipoDespesa"
                                    name="tipoDespesa"
                                    value={movimento.tipoDespesa}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione o Tipo de Despesa</option>
                                    {tipoDespesas.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="fornecedor">Fornecedor</label>
                                <select
                                    id="fornecedor"
                                    name="fornecedor"
                                    value={movimento.fornecedor}
                                    onChange={handleChange}
                                >
                                    <option value="">Nenhum Fornecedor</option>
                                    {fornecedores.map((fornecedor) => (
                                        <option key={fornecedor.id} value={fornecedor.id}>
                                            {fornecedor.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="dentista">Dentista</label>
                                <select
                                    id="dentista"
                                    name="dentista"
                                    value={movimento.dentista}
                                    onChange={handleChange}
                                >
                                    <option value="">Nenhum Dentista</option>
                                    {dentistas.map((dentista) => (
                                        <option key={dentista.id} value={dentista.id}>
                                            {dentista.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    <div className={styles.modalidadeTaxaValor}>
                        <div className={styles.formGroupHalf}>
                            <label htmlFor="modalidade">Modalidade de Pagamento</label>
                            <select
                                id="modalidade"
                                name="modalidade"
                                value={movimento.modalidade}
                                onChange={handleChange}
                                disabled={movimento.operacao === 'Sangria' || movimento.operacao === 'Aporte'}
                            >
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Crédito">Crédito</option>
                                <option value="Débito">Débito</option>
                            </select>
                        </div>
                        {movimento.modalidade === 'Crédito' && (
                            <div className={styles.formGroupHalf}>
                                <label htmlFor="taxa">Taxa (%)</label>
                                <input
                                    id="taxa"
                                    name="taxa"
                                    type="number"
                                    value={movimento.taxa}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        )}
                        <div className={styles.formGroupHalf}>
                            <label htmlFor="valor">Valor</label>
                            <input
                                id="valor"
                                name="valor"
                                type="number"
                                value={movimento.valor}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={movimento.descricao}
                            onChange={handleChange}
                        />
                    </div>
                </form>
                <Footer buttons={buttons} />
            </div>
        </Dashboard>
    );
}

export default NovoMovimento;
