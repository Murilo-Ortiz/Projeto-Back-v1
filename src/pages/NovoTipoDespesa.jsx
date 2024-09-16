import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import styles from '../styles/pages/NovoTipoDespesa.module.css';
import { fetchTipoDespesaById, createTipoDespesa, updateTipoDespesa, deleteTipoDespesa } from '../api/tipoDespesa';

function NovoTipoDespesa() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tipoDespesa, setTipoDespesa] = useState({ descricao: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id) {
            const getTipoDespesa = async () => {
                try {
                    const data = await fetchTipoDespesaById(id);
                    setTipoDespesa(data);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Erro ao buscar tipo de despesa:', error);
                }
            };
            getTipoDespesa();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipoDespesa((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateTipoDespesa(id, tipoDespesa);
            } else {
                await createTipoDespesa(tipoDespesa);
            }
            navigate('/despesas');
        } catch (error) {
            console.error('Erro ao salvar tipo de despesa:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTipoDespesa(id);
            navigate('/despesas');
        } catch (error) {
            console.error('Erro ao excluir tipo de despesa:', error);
        }
    };

    const handleCancel = () => {
        navigate('/despesas');
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
                <h1 className={styles.title}>{isEditing ? 'Editar Tipo de Despesa' : 'Adicionar Novo Tipo de Despesa'}</h1>
                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="descricao">Descrição</label>
                        <input
                            id="descricao"
                            name="descricao"
                            type="text"
                            value={tipoDespesa.descricao}
                            onChange={handleChange}
                        />
                    </div>
                    <Footer buttons={buttons} />
                </form>
            </div>
        </Dashboard>
    );
}

export default NovoTipoDespesa;
