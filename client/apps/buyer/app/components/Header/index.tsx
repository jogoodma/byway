import React from "react";

export interface TitleProps {
  children?: React.ReactNode;
}

const Title: React.FC<TitleProps> = (props) => {
  return <div className="title">{props.children}</div>;
};

export interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <Title>Byway</Title>
    </header>
  );
};

export default Header;
