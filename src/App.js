import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Caixa from './pages/Caixa';
import NovoMovimento from './pages/NovoMovimento';
import DetalhesMovimento from './pages/DetalhesMovimento';
import Dentistas from './pages/Dentistas';
import Fornecedores from './pages/Fornecedores';
import NovoFornecedor from './pages/NovoFornecedor'; // Adicionando a importação
import NovoDentista from './pages/NovoDentista'; // Adicionando a importação
import Relatorios from './pages/Relatorios';
import Receitas from './pages/Receitas';
import TipoDespesas from './pages/Despesas';
import NovoTipoDespesa from './pages/NovoTipoDespesa';
import PrivateRoute from './components/PrivateRoute';
import NovoTipoReceita from './pages/NovoTipoReceita';
import Logout from './components/Logout'; // Adicionando a importação

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/logout" element={<Logout />} />

                <Route path="/caixa" element={<PrivateRoute><Caixa /></PrivateRoute>} />
                <Route path="/novo-movimento" element={<PrivateRoute><NovoMovimento /></PrivateRoute>} />
                <Route path="/detalhes-movimento/:id" element={<PrivateRoute><DetalhesMovimento /></PrivateRoute>} />

                <Route path="/dentistas" element={<PrivateRoute><Dentistas/></PrivateRoute>} />
                <Route path="/novo-dentista" element={<PrivateRoute><NovoDentista /></PrivateRoute>} />
                <Route path="/dentista/:id" element={<PrivateRoute><NovoDentista /></PrivateRoute>} /> {/* Editar dentista */}

                <Route path="/fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
                <Route path="/novo-fornecedor" element={<PrivateRoute><NovoFornecedor /></PrivateRoute>} />
                <Route path="/fornecedor/:id" element={<PrivateRoute><NovoFornecedor /></PrivateRoute>} /> {/* Editar fornecedor */}

                <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>}/>
                <Route path="/receitas" element={<PrivateRoute><Receitas /></PrivateRoute>} />
                <Route path="/novo-tipo-receita" element={<PrivateRoute><NovoTipoReceita /></PrivateRoute>} />
                <Route path="/tipo-receita/:id" element={<PrivateRoute><NovoTipoReceita /></PrivateRoute>} />
                <Route path="/despesas" element={<PrivateRoute><TipoDespesas /></PrivateRoute>} />
                <Route path="/novo-tipo-despesa" element={<PrivateRoute><NovoTipoDespesa /></PrivateRoute>} />
                <Route path="/tipo-despesa/:id" element={<PrivateRoute><NovoTipoDespesa /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
