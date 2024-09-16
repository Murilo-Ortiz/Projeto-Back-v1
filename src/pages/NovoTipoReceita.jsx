import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import styles from '../styles/pages/NovoTipoReceita.module.css';
import { fetchTipoReceitaById, createTipoReceita, updateTipoReceita, deleteTipoReceita } from '../api/tipoReceita';

function NovoTipoReceita() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tipoReceita, setTipoReceita] = useState({ descricao: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            const getTipoReceita = async () => {
                try {
                    const data = await fetchTipoReceitaById(id);
                    setTipoReceita(data);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Erro ao buscar tipo de receita:', error);
                }
            };
            getTipoReceita();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipoReceita((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateFields = () => {
        const newErrors = {};
        if (!tipoReceita.descricao) newErrors.descricao = 'O campo Descrição é obrigatório.';
        return newErrors;
    };

    const handleSave = async () => {
        if (isSaving) return;

        setIsSaving(true);

        const newErrors = validateFields();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSaving(false);
            return;
        }

        try {
            if (isEditing) {
                await updateTipoReceita(id, tipoReceita);
            } else {
                await createTipoReceita(tipoReceita);
            }
            navigate('/receitas');
        } catch (error) {
            console.error('Erro ao salvar tipo de receita:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTipoReceita(id);
            navigate('/receitas');
        } catch (error) {
            console.error('Erro ao excluir tipo de receita:', error);
        }
    };

    const handleCancel = () => {
        navigate('/receitas');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    const buttons = [
        { type: 'save', text: 'Salvar', disabled: isSaving },
        { type: 'cancel', text: 'Voltar', onClick: handleCancel }
    ];

    if (isEditing) {
        buttons.push({ type: 'delete', text: 'Excluir', onClick: handleDelete });
    }

    return (
        <Dashboard>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>{isEditing ? 'Editar Tipo de Receita' : 'Adicionar Novo Tipo de Receita'}</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="descricao">Descrição</label>
                        {errors.descricao && <span className={styles.error}>{errors.descricao}</span>}
                        <input
                            id="descricao"
                            name="descricao"
                            type="text"
                            maxLength="100"
                            value={tipoReceita.descricao}
                            onChange={handleChange}
                        />
                    </div>
                    <Footer buttons={buttons} />
                </form>
            </div>
        </Dashboard>
    );
}

export default NovoTipoReceita;
