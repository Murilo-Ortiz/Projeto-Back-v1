import React from 'react';
import { useNavigate } from 'react-router-dom';
import { closeCaixa, checkCaixaStatus } from "../api/caixa";

function Logout() {
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleLogout = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                navigate('/login');
                return;
            }

            try {
                // Verifique o status do caixa via backend
                const caixaStatus = await checkCaixaStatus(userId);

                if (caixaStatus && caixaStatus.id) {
                    // Se o caixa estiver aberto, feche o caixa
                    await closeCaixa(userId);
                    console.log('Caixa fechado com sucesso');
                }

                // Limpar o armazenamento local
                localStorage.removeItem("userId");
                localStorage.removeItem("authToken");
                localStorage.removeItem(`caixaId_${userId}`); // Remover o caixaId específico do usuário

                console.log('Redirecionando para /login');
                navigate('/login');
            } catch (error) {
                console.error('Erro durante o logout:', error);
            }
        };

        handleLogout();
    }, [navigate]);

    return null;
}

export default Logout;
