import React from 'react';
import LogoIcon from "../../images/logo.png"
import { HeaderContainer, Logo } from "./HeaderStyles"

const Header = () => {
    return (
        <HeaderContainer>
            <Logo src={LogoIcon} alt="Ahoy logo" />
        </HeaderContainer>
    );
};

export default Header;