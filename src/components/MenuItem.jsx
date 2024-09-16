// src/MenuItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

function MenuItem({ icon, label, to }) {
    return (
        <li className={styles.menuItem}>
            <Link to={to} className={styles.menuLink}>
                <img src={icon} alt={label} className={styles.menuIcon} />
                <span>{label}</span>
            </Link>
        </li>
    );
}

export default MenuItem;
