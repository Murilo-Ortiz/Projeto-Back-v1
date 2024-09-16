import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import styles from '../styles/pages/NovoDentista.module.css';
import { fetchDentistaById, createDentista, updateDentista, deleteDentista } from '../api/dentistas';

function NovoDentista() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dentista, setDentista] = useState({
        nome: '',
        fone: '',
        cpf: '',
        cro: '',
        percentualRecebido: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Estado para controlar o botão de salvar
    const [errors, setErrors] = useState({}); // Estado para armazenar erros de validação

    useEffect(() => {
        if (id) {
            const getDentista = async () => {
                try {
                    const data = await fetchDentistaById(id);
                    setDentista(data);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Erro ao buscar dentista:', error);
                }
            };
            getDentista();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDentista((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Limpa o erro do campo específico
    };

    const sanitizeDentista = (dentista) => {
        const sanitized = { ...dentista };
        sanitized.cpf = dentista.cpf.replace(/[^\d]/g, ''); // Remove pontos e traços
        sanitized.fone = dentista.fone.replace(/[^\d]/g, ''); // Remove parênteses, espaços e traços
        return sanitized;
    };

    const validateFields = () => {
        const newErrors = {};
        if (!dentista.nome) newErrors.nome = 'O campo Nome é obrigatório.';
        if (!dentista.fone) newErrors.fone = 'O campo Telefone é obrigatório.';
        if (!dentista.cpf) newErrors.cpf = 'O campo CPF é obrigatório.';
        if (!dentista.cro) newErrors.cro = 'O campo CRO é obrigatório.';
        if (!dentista.percentualRecebido) newErrors.percentualRecebido = 'O campo percentual é obrigatório.';
        return newErrors;
    };

    const handleSave = async () => {
        if (isSaving) return; // Previne múltiplas submissões se já estiver salvando

        setIsSaving(true); // Desativa o botão após o início do envio

        const newErrors = validateFields();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSaving(false);
            return;
        }

        const sanitizedDentista = sanitizeDentista(dentista);

        try {
            if (isEditing) {
                await updateDentista(id, sanitizedDentista);
            } else {
                await createDentista(sanitizedDentista);
            }
            navigate('/dentistas');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Erro de validação:', error.response.data.errors);
            } else {
                console.error('Erro ao salvar dentista:', error);
            }
        } finally {
            setIsSaving(false); // Reativa o botão após o envio
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDentista(id);
            navigate('/dentistas');
        } catch (error) {
            console.error('Erro ao excluir dentista:', error);
        }
    };

    const handleCancel = () => {
        navigate('/dentistas');
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário
        handleSave();       // Garante que o handleSave seja chamado apenas uma vez
    };

    const buttons = [
        { type: 'save', text: 'Salvar', disabled: isSaving }, // Tipo 'submit' para garantir que o formulário envie
        { type: 'cancel', text: 'Voltar', onClick: handleCancel }
    ];

    if (isEditing) {
        buttons.push({ type: 'delete', text: 'Excluir', onClick: handleDelete });
    }

    return (
        <Dashboard>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>{isEditing ? 'Editar Dentista' : 'Adicionar Novo Dentista'}</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nome">Nome</label>
                        {errors.nome && <span className={styles.error}>{errors.nome}</span>}
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            maxLength="100"
                            value={dentista.nome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fone">Telefone</label>
                        {errors.fone && <span className={styles.error}>{errors.fone}</span>}
                        <InputMask
                            mask="(99) 99999-9999"
                            id="fone"
                            name="fone"
                            value={dentista.fone}
                            onChange={handleChange}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="cpf">CPF</label>
                        {errors.cpf && <span className={styles.error}>{errors.cpf}</span>}
                        <InputMask
                            mask="999.999.999-99"
                            id="cpf"
                            name="cpf"
                            value={dentista.cpf}
                            onChange={handleChange}
                        >
                            {(inputProps) => <input {...inputProps} type="text" />}
                        </InputMask>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="cro">CRO</label>
                        {errors.cro && <span className={styles.error}>{errors.cro}</span>}
                        <input
                            id="cro"
                            name="cro"
                            type="text"
                            maxLength="20"
                            value={dentista.cro}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="percentualRecebido">Percentual Recebido</label>
                        {errors.percentualRecebido && <span className={styles.error}>{errors.percentualRecebido}</span>}
                        <input
                            id="percentualRecebido"
                            name="percentualRecebido"
                            type="number"
                            step="0.01"
                            max="100"
                            value={dentista.percentualRecebido}
                            onChange={handleChange}
                        />
                    </div>
                    <Footer buttons={buttons} />
                </form>
            </div>
        </Dashboard>
    );
}

export default NovoDentista;
