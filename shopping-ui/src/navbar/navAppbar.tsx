import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../service/utils';
import LoginIcon from '@mui/icons-material/Login';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import { checkoutCart } from '../service/api-service';
import Snackbar from '@mui/material/Snackbar';


function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}


export default function NavAppbar(props) {
    const isLoggedIn = props.isLoggedIn;
    console.log(isLoggedIn, "  adada")
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openSnack, setOpenSnack] = React.useState(false);

    const open = Boolean(anchorEl);

    const handleSnackClose = () => {
        setOpenSnack(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log('logout invoked')
        logout();
        console.log(history)
        handleClose();
        history.push('/');
    }

    const checkOutItem = () => {
        checkoutCart().then(res => {
            if (res.status === 200) {
                setOpenSnack(true);
            }
        })
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            SHOPPING-PORTAL
                        </Typography>
                        <Tooltip title="Checkout"><IconButton color="inherit"><AddShoppingCartIcon /></IconButton></Tooltip>
                        <Tooltip title="cart"><IconButton color="inherit"><ShoppingCartIcon /></IconButton></Tooltip>
                        {isLoggedIn ? <Avatar style={{ cursor: 'pointer' }} onClick={(event) => handleClick(event)} {...stringAvatar('Sagar Jain')} /> : <LoginIcon />}
                        <Menu id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={handleClose}>My Order</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
            <Snackbar
                open={openSnack}
                onClose={handleSnackClose}
                message="Checkout Succesfully"
            />
        </>
    );
}