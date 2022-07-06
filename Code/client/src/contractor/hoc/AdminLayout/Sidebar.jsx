import React from 'react';
import { Link } from 'react-router-dom';

/* eslint jsx-a11y/anchor-is-valid: 0 */

const styles = {
  percentStyle: {
    border: '1px solid white',
    padding: '2px 8px',
    fontSize: 10,
    marginRight: 5,
    marginLeft: '-3px',
    borderRadius: 5,
  },
  icon: {
    marginRight: 15,
    fontSize: 20,
    display: 'inline-block',
  },
  label: {
    minWidth: 50,
    textAlign: 'left',
    display: 'inline-block',
    paddingLeft: 3,
  },
};

const SideBar = () => (
    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
        <div className="menu_section">
            <ul className="nav side-menu">
                <li>
                    <Link to="/contractor/dashboard">
                        <span className="handel-home" style={styles.icon} />
                        <span style={styles.label}>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contractor/drivers">
                        <span className="handel-users" style={styles.icon} />
                        <span style={styles.label}>Drivers</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contractor/vehicles">
                        <span className="handel-truck" style={styles.icon} />
                        <span style={styles.label}>Vehicles</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contractor/transactions">
                        <span className="handel-history" style={styles.icon} />
                        <span style={styles.label}>Transactions</span>
                    </Link>
                </li>
                <li>
                    <Link to="/contractor/summary">
                        <span className="handel-document" style={styles.icon} />
                        <span style={styles.label}>Runsheet Summary</span>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
);

export default SideBar;
