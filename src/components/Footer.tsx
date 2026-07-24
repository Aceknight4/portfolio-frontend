import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bp-footer">
      <span>© {year} Seppo Anel</span>
      <span>Buea, Cameroon</span>
    </footer>
  );
};

export default Footer;