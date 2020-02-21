import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';
import { NONPROFIT } from '../../../../../helpers/userRoles';
import { signIn, signUp } from '../../../../common/authModals/modalTypes';

class MobileMenu extends Component {

    state = {
        currentMenu: 'home'
    }

    render() {
        let { currentMenu } = this.state;
        const { isAuth, user, isShow, onCloseMobileMenu, onClickSearch } = this.props;

        return (
            <div className={`hidden-mnu ${isShow ? 'fade-in show' : 'fade-out'}`}>
                <div className="hidden-mnu__overlay"></div>
                <div className="hidden-mnu__box">
                    <div className="hidden-mnu__box--top">
                        <div className="logo">
                            <img
                                src="/images/ui-icon/logo.png" alt="logo"
                                onClick={() => 
                                    (isAuth && user.role === NONPROFIT) ? 
                                        history.push(`/${user._id}/dashboard`) 
                                        : (isAuth && user.role !== NONPROFIT) ? history.push(`/${user._id}/news-feed`) : history.push('/')
                                }
                            />
                        </div>
                        <div className="header-toggle">
                            <span className={`toggle-mnu hidden-toggle fade-in ${isShow ? 'on' : ''}`} onClick={onCloseMobileMenu}>
                                <span></span>
                            </span>
                        </div>
                        {/* <div className="header-toggle">
                            <span className={`toggle-mnu hidden-toggle fade-in`}>
                                <span></span>
                            </span>
                        </div> */}
                    </div>
                    <div className="hidden-mnu__box--middle">
                        <form className="search" method="get" action="" role="search">
                            <input 
                                type="search"
                                className="search-field"
                                placeholder="Search …"
                                onMouseDown={onClickSearch}
                                onClick={onClickSearch}
                                autoComplete="off"
                                name="s"
                                title=""
                            />
                            <button className="btn btn--search" onClick={onClickSearch} onMouseDown={onClickSearch}>
                                <span className="icon-search"></span>
                            </button>
                        </form>
                        <nav className="main-mnu">
                            <ul>
                                <li className={`menu-item ${currentMenu === 'home' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink to={`/`} onClick={e => {
                                        this.setState({
                                            currentMenu: 'home'
                                        });
                                        onCloseMobileMenu(e);
                                    }}>
                                        <span>Home</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item ${currentMenu === 'nonprofit' ? 'has-current-menu-item' : ''} `}>
                                    <NavLink to={`/nonProfit`} onClick={e => {
                                        this.setState({
                                            currentMenu: 'nonprofit'
                                        });
                                        onCloseMobileMenu(e);
                                    }}>
                                        <span>Nonprofit</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item menu-item-has-children ${currentMenu === 'learn' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink to={`/learn`} onClick={e => {
                                        this.setState({
                                            currentMenu: 'learn'
                                        });
                                        onCloseMobileMenu(e);
                                    }}>
                                        <span>Learn more</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item menu-item-has-children ${currentMenu === 'about' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink to={`/about`} onClick={e => {
                                        this.setState({
                                            currentMenu: 'about'
                                        });
                                        onCloseMobileMenu(e);
                                    }}>
                                        <span>About Us</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item ${currentMenu === 'discovery' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink exact to="/discovery" onClick={e => {
                                        this.setState({
                                            currentMenu: 'discovery'
                                        });
                                        onCloseMobileMenu(e);
                                    }}>
										<span>Discover</span>
									</NavLink>
                                </li>
                                <li className={`menu-item ${currentMenu === 'blog' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink
                                        to = {`/`}
                                        onClick = { e => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            this.setState({
                                                currentMenu: 'blog'
                                            });
                                            onCloseMobileMenu(e);

                                            const win = window.open('https://medium.com/onegivv', '_blank');
                                            win.focus();
                                        }}>
                                            <span>Blog</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item login ${currentMenu === 'login' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink
                                        to = {`/`}
                                        onClick = { e => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            this.setState({
                                                currentMenu: 'login'
                                            });
                                            onCloseMobileMenu(e);
                                            history.push(`?modal=${signIn}`);
                                        }}>
                                            <span>Log in</span>
                                    </NavLink>
                                </li>
                                <li className={`menu-item signup ${currentMenu === 'signup' ? 'has-current-menu-item' : ''}`}>
                                    <NavLink
                                        to = {`/`}
                                        onClick = { e => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            this.setState({
                                                currentMenu: 'signup'
                                            });
                                            onCloseMobileMenu(e);
                                            history.push(`?modal=${signUp}`);
                                        }}>
                                            <span>Sign up</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </div>
        )
    }

}

export default MobileMenu