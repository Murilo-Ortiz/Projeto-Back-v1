import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Footer from '../components/Footer';
import styles from '../styles/pages/NovoFornecedor.module.css';
import { fetchFornecedorById, createFornecedor, updateFornecedor, deleteFornecedor } from '../api/fornecedores';
import InputMask from 'react-input-mask';

// Função para sanitizar o número de telefone
const sanitizePhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
};

function NovoFornecedor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [fornecedor, setFornecedor] = useState({
        nome: '',
        fone: '',
        endereco: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            const getFornecedor = async () => {
                try {
                    const data = await fetchFornecedorById(id);
                    setFornecedor(data);
                    setIsEditing(true);
                } catch (error) {
                    console.error('Erro ao buscar fornecedor:', error);
                }
            };
            getFornecedor();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFornecedor((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateFields = () => {
        const newErrors = {};
        if (!fornecedor.nome) newErrors.nome = 'O campo Nome é obrigatório.';
        if (!fornecedor.fone) newErrors.fone = 'O campo Telefone é obrigatório.';
        if (!fornecedor.endereco) newErrors.endereco = 'O campo Endereço é obrigatório.';
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

        // Sanitiza o telefone antes de enviar ao backend
        const sanitizedFornecedor = {
            ...fornecedor,
            fone: sanitizePhoneNumber(fornecedor.fone),
        };

        try {
            if (isEditing) {
                await updateFornecedor(id, sanitizedFornecedor);
            } else {
                await createFornecedor(sanitizedFornecedor);
            }
            navigate('/fornecedores');
        } catch (error) {
            console.error('Erro ao salvar fornecedor:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteFornecedor(id);
            navigate('/fornecedores');
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
        }
    };

    const handleCancel = () => {
        navigate('/fornecedores');
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
                <h1 className={styles.title}>{isEditing ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nome">Nome</label>
                        {errors.nome && <span className={styles.error}>{errors.nome}</span>}
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            maxLength="100"
                            value={fornecedor.nome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fone">Telefone</label>
                        {errors.fone && <span className={styles.error}>{errors.fone}</span>}
                        <InputMask
                            id="fone"
                            name="fone"
                            mask="(99) 99999-9999"
                            value={fornecedor.fone}
                            onChange={handleChange}
                        >
                            {(inputProps) => <input {...inputProps} maxLength="15" />}
                        </InputMask>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="endereco">Endereço</label>
                        {errors.endereco && <span className={styles.error}>{errors.endereco}</span>}
                        <input
                            id="endereco"
                            name="endereco"
                            type="text"
                            maxLength="200"
                            value={fornecedor.endereco}
                            onChange={handleChange}
                        />
                    </div>
                    <Footer buttons={buttons} />
                </form>
            </div>
        </Dashboard>
    );
}

export default NovoFornecedor;
