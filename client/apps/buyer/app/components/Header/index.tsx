import React from "react";
import { Link } from "@remix-run/react";

export interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <h1 className="title">Byway</h1>
      <div className="sub-header">
        <div>
          <nav>
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/stores">Stores</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
            </ol>
          </nav>
        </div>
        <div className="user-status">User</div>
      </div>
    </header>
  );
};

export default Header;
