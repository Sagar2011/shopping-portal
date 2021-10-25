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
        items: [
            {
                "name": "Lynn Pearson",
                "id": 7
            },
            {
                "name": "Paki Moody",
                "id": 8
            },
            {
                "name": "Basia Sears",
                "id": 9
            },
            {
                "name": "Nicholas Garrett",
                "id": 6
            },
            {
                "name": "Francis Trujillo",
                "id": 4
            }
        ],
        limit: 0,
        requireMoreScroll: false,
        cart: [],
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
                dataArray = dataArray.concat(response.data.items);
                const requireBoolean = dataArray.length === response.data.total ? false : true;
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
        if (this.state.items !== prevState.items || this.state.requireMoreScroll !== prevState.requireMoreScroll) {
            console.log('update with changes ')
            console.log(this.state)
            this.renderUI();
        } else if (this.state.cart !== prevState.cart || this.state.addCart !== prevState.addCart) {
            this.renderUI();
        }
    }

    addToCart(id) {
        // console.log('filter', id);
        // let array = this.state.cart;
        // array = array.concat(id);
        // this.setState({ cart: array });
        addToCart(id).then((res) => {
            this.setState({ addCart: true });
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
                            loader={<ShopLoader />}
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
                                {this.state.items.map((elevation: ItemModel) => (
                                    <Item key={elevation.name} elevation={elev} style={{ backgroundColor: this.getRandomColor() }}>
                                        <Typography variant="h5" gutterBottom component="div">
                                            {elevation.name}
                                        </Typography>
                                        {!this.state.cart.includes(elevation.id as never) ?
                                            <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={() => this.addToCart(elevation.id)}>
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