import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { ItemModel } from '../models/model';
import { getAllItems, getCartItems, addToCart } from '../service/api-service';
import InfiniteScroll from "react-infinite-scroll-component";
import Typography from '@mui/material/Typography';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from '@mui/material/Button';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import ShopLoader from './loader';
import { Snackbar, Alert } from '@mui/material';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '50%',
    lineHeight: '60px'
}));


const lightTheme = createTheme({ palette: { mode: 'light' } });
const elev = 24;

class Clip extends React.Component {
    state = {
        items: [],
        limit: 0,
        requireMoreScroll: false,
        cart: [{ ItemId: 0, Name: '' }],
        addCart: false
    }

    callCartsItemService() {
        getCartItems().then((response) => {
            if (response.data !== undefined || response.data !== null) {
                let dataArray = response.data;
                this.setState({ cart: dataArray });
            }
        });
    }
    callItemService() {
        console.log('calling test ', this.state)
        getAllItems(this.state.items.length).then((response) => {
            if (response.data !== undefined || response.data !== null) {
                let dataArray = this.state.items;
                dataArray = dataArray.concat(response.data.Items);
                const requireBoolean = dataArray.length === response.data.Total ? false : true;
                this.setState({ items: dataArray, limit: response.data.total, requireMoreScroll: requireBoolean });
            }
        }).catch();
    }
    componentDidMount() {
        console.log('once called')
        this.callItemService();
        this.callCartsItemService();
    }

    componentDidUpdate(prevState) {
        console.log('update called')
        console.log('d  ', this.state.cart?.filter(e => e.ItemId === 2).length)
        if (this.state.items !== prevState.items || this.state.requireMoreScroll !== prevState.requireMoreScroll) {
            console.log('update with changes ')
            console.log(this.state)
            this.renderUI();
        } else if (this.state.cart !== prevState.cart || this.state.addCart !== prevState.addCart) {
            this.renderUI();
        }
    }

    addToCart(id) {
        addToCart(id).then((res) => {
            addToCart(id).then((res) => {
                if (res.status == 200) {
                    this.setState({ addCart: true });
                }
            });
            this.callCartsItemService();
        });
    }

    getRandomColor() {
        const color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
        return color;
    }
    handleCloseSnack() {
        this.setState({ addCart: false });
    }

    renderUI() {
        return (
            <Grid container spacing={2}>
                {<Snackbar open={this.state.addCart} autoHideDuration={1500} onClose={this.handleCloseSnack.bind(this)} style={{ position: 'sticky' }}>
                    <Alert onClose={this.handleCloseSnack.bind(this)} severity="success">
                        Added to carts!
                    </Alert>
                </Snackbar>}
                <Grid item sx={{
                    p: 2,
                    bgcolor: 'background.default',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    margin: '47px 0px 0px 65px'
                }}>
                    <ThemeProvider theme={lightTheme}>
                        <InfiniteScroll
                            dataLength={this.state.items.length}
                            next={this.callItemService.bind(this)}
                            hasMore={this.state.requireMoreScroll}
                            loader={<div style={{ marginLeft: '850px' }}><ShopLoader /></div>}
                            endMessage={
                                <h2 style={{
                                    color: 'gray',
                                    margin: '350px 0px 0px 600px'
                                }}>.....NO More Data Available....</h2>
                            }
                            scrollableTarget={() => document.getElementById('el-which-has-overflow-defined')}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'background.default',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    '& > :not(style)': {
                                        m: 1,
                                        width: 250,
                                        height: 100,
                                    },
                                }}
                            >
                                {this.state.items?.map((elevation: ItemModel) => (
                                    <Item key={elevation.Name} elevation={elev} style={{ backgroundColor: this.getRandomColor() }}>
                                        <Typography variant="body2" gutterBottom component="div">
                                            {elevation.Name}
                                        </Typography>
                                        {((this.state.cart?.filter(e => e.ItemId === elevation.ID) === undefined) || (this.state.cart?.filter(e => e.ItemId === elevation.ID).length === 0)) ?
                                            <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={this.addToCart.bind(this, elevation.ID)}>
                                                Add
                                            </Button>
                                            :
                                            <BookmarkAddedIcon />
                                        }
                                    </Item>
                                ))}

                            </Box>
                        </InfiniteScroll>
                    </ThemeProvider>
                </Grid >
            </Grid >
        )
    }
    render() {
        return <>
            {this.renderUI()}
        </>
    }
}

export default Clip;