import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Table.module.css';

function Table({ data, columns, onRowClick, onDelete, onSearch, usePagination = true }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Ajuste o número de itens por página conforme necessário

    // Atualiza o estado `filteredData` sempre que `data`, `searchTerm`, ou `currentPage` mudar
    useEffect(() => {
        if (!onSearch) {
            // Filtragem local se `onSearch` não estiver definido
            const filtered = data.filter((item) =>
                columns.some((column) =>
                    item[column.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }
    }, [data, searchTerm, columns, onSearch, currentPage]);

    // Lida com mudanças no campo de busca
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (onSearch) {
            // Se uma função `onSearch` for passada, ela é chamada
            onSearch(value);
        }
    };

    // Função para alterar a página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Total de páginas
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Calcula o índice inicial e final dos itens a serem exibidos na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.tableContainer}>
            {/* Barra de pesquisa acima da tabela */}
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </div>

            {usePagination ? (
                <>
                    <table className={styles.table}>
                        <thead>
                        <tr className={styles.nonSelectable}>
                            {columns.map((column) => (
                                <th key={column.key}>{column.label}</th>
                            ))}
                            <th>Actions</th> {/* Coluna para as ações, como editar e excluir */}
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => (
                                <tr key={item.id} onClick={() => onRowClick(item.id)}>
                                    {columns.map((column) => (
                                        <td key={column.key}>
                                            {item[column.key] !== undefined ? item[column.key] : 'N/A'}
                                        </td>
                                    ))}
                                    <td>
                                        {/* Botão de edição */}
                                        <button
                                            className={styles.editButton}
                                        >
                                            ✏️
                                        </button>

                                        {/* Botão de exclusão, mostrado apenas se `onDelete` for passado */}
                                        {onDelete && (
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita acionar o clique da linha
                                                    onDelete(item.id);
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1}>Nenhum dado encontrado</td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {/* Paginação */}
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={currentPage === index + 1 ? styles.activePage : ''}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr className={styles.nonSelectable}>
                        {columns.map((column) => (
                            <th key={column.key}>{column.label}</th>
                        ))}
                        <th>Actions</th> {/* Coluna para as ações, como editar e excluir */}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <tr key={item.id} onClick={() => onRowClick(item.id)}>
                                {columns.map((column) => (
                                    <td key={column.key}>
                                        {item[column.key] !== undefined ? item[column.key] : 'N/A'}
                                    </td>
                                ))}
                                <td>
                                    {/* Botão de edição */}
                                    <button
                                        className={styles.editButton}
                                    >
                                        ✏️
                                    </button>

                                    {/* Botão de exclusão, mostrado apenas se `onDelete` for passado */}
                                    {onDelete && (
                                        <button
                                            className={styles.deleteButton}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita acionar o clique da linha
                                                onDelete(item.id);
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1}>Nenhum dado encontrado</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Table;
