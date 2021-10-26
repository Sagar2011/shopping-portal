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
import { getEmail, getJwt, logout } from '../service/utils';
import LoginIcon from '@mui/icons-material/Login';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import { checkoutCart, getCartItems, getOrderHistory } from '../service/api-service';
import Snackbar from '@mui/material/Snackbar';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import { Divider } from '@mui/material';
import { OrderModel } from '../models/model';

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

function stringAvatar() {
    const name = getEmail();
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function NavAppbar() {

    const [loggedIn, setLoggedIn] = React.useState(getJwt() !== null);

    const history = useHistory();

    const [openModal, setOpenModal] = React.useState(false);

    const [modal, setModal] = React.useState([]);

    const handleModalOpen = () => {
        setOpenModal(true);
        getOrderHistory().then((res) => {
            if (res.status == 200) {
                setModal(res.data);
            }
        });
    }
    const handleModalClose = () => setOpenModal(false);

    const [options, setOptions] = React.useState([{ ItemId: 0, Name: '' }]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorElCart, setAnchorElCart] = React.useState(null);

    const [openSnack, setOpenSnack] = React.useState(false);
    const [message, setMessage] = React.useState("");


    const open = Boolean(anchorEl);
    const openCart = Boolean(anchorElCart);

    const handleSnackClose = () => {
        setOpenSnack(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCartClick = (event) => {
        setAnchorElCart(event.currentTarget);
        if (getJwt()) {
            getCartItems().then((response) => {
                setOptions(response.data);
            });
        }
    };

    const handleCloseCart = () => {
        setAnchorElCart(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log('logout invoked')
        logout();
        handleClose();
        setLoggedIn(false);
        history.push('/');
    }

    const checkOutItem = () => {
        checkoutCart().then(res => {
            if (res.status === 200) {
                setMessage("Checkout Done !!")
                setOpenSnack(true);
            } else if (res.status === 404) {
                setMessage("No Item For Checkout!!")
            }
        }).catch(() => {
            setMessage("No Item For Checkout!!")
        })
    }



    const ITEM_HEIGHT = 48;
    setInterval(() => {
        if (!loggedIn) {
            if (getJwt()) {
                setLoggedIn(true);
            }
        }
    }, 3000);
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            SHOPPING-PORTAL
                        </Typography>
                        <Tooltip title="Checkout"><IconButton color="inherit" onClick={() => checkOutItem()}><AddShoppingCartIcon /></IconButton></Tooltip>
                        <Tooltip title="cart"><IconButton color="inherit" onClick={(event) => handleCartClick(event)}><ShoppingCartIcon /></IconButton></Tooltip>
                        {loggedIn ? <Avatar style={{ cursor: 'pointer' }} onClick={(event) => handleClick(event)} {...stringAvatar()} /> : <LoginIcon />}
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
                            <MenuItem onClick={handleModalOpen}>My Order</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorElCart}
                            open={openCart}
                            onClose={handleCloseCart}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options?.map((option) => (
                                <MenuItem key={option.ItemId} onClick={handleCloseCart}>
                                    {option.ItemId} | {option.Name}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Toolbar>
                </AppBar>
            </Box>
            <Snackbar
                open={openSnack}
                onClose={handleSnackClose}
                message={message}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Order History
                        </Typography>
                        {modal?.map((el: OrderModel) => {
                            <><Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                {el.ID}  |  {el.CreatedAt}
                            </Typography><Divider /></>
                        })}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
}