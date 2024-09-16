import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from '../styles/components/Dashboard.module.css';

const Dashboard = ({ children }) => {
    return (
        <div className={styles.dashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header />
                <div className={styles.contentWrapper}>
                    {children} {/* Conteúdo dinâmico */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
