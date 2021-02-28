import React from 'react'
import './Header.css';
import SearchIcon from '@material-ui/icons/Search'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth } from './firebase';
function Header() {
    const [{basket,user},dispatch]=useStateValue();

    const handleAuthentication = ()=>
    {
        if(user)
        auth.signOut();
    }

    return (
        <div className="header">
            <Link to="/">
                <img 
                    className="header_logo"
                    src="https://pngimg.com/uploads/amazon/amazon_PNG11.png">
                </img>
            </Link>

            <div className="header_search">
                <input
                    className="header_search_input"
                    type="text">
                </input>
                <SearchIcon 
                    className="header_searchIcon"/>
            </div>

            <div className="header_nav">
                <Link to={!user && '/login'}>
                <div onClick={handleAuthentication} className="header_option">

                <span className="header_option_lineOne"> Hello {user?user.email:'Guest'}</span>
                    <span className="header_option_lineTwo">{user?'Sign out':'Sign in'}</span>

                </div>
                </Link>
                <Link to="/orders">
                    <div className="header_option">
                        <span className="header_option_lineOne"> Returns</span>
                        <span className="header_option_lineTwo">Orders</span>
                    </div>
                </Link>
                <div className="header_option">

                    <span className="header_option_lineOne"> Your</span>
                    <span className="header_option_lineTwo">Prime</span>

                </div>
                <Link to="/checkout">
                    <div className="header_optionBasket">
                        <ShoppingBasketIcon/>
                        <span className="header_option_lineTwo header_basketCount">{basket?.length}</span>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Header
