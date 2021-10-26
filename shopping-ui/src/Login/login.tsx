import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import DoneIcon from '@mui/icons-material/Done';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { useHistory } from 'react-router-dom';
import { saveInfo, logout } from '../service/utils';
import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { callAuthToken, registerUser } from '../service/api-service';
import ShopLoader from '../common/loader';


interface Auth {
    username: string;
    password: string;
    showPassword: boolean;
}



function Login() {
    const [values, setValues] = React.useState<Auth>({
        username: '',
        password: '',
        showPassword: false,
    });

    const [openSnack, setOpenSnack] = React.useState(false);
    const [showLoader, setShowLoader] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const handleCloseSnack = () => {
        setOpenSnack(false);
        setMessage("")
    };

    const handleOpenSnack = (msg) => {
        setOpenSnack(true);
        setMessage(msg)
    };

    useEffect(() => {
        //
    }, [showLoader, openSnack]);

    const history = useHistory();

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleChange = (prop: keyof Auth) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleLogin = (typeCall) => {
        setShowLoader(true);
        if (typeCall === 'login') {
            callAuthToken(values.username, values.password).then(response => {
                setShowLoader(false);
                if (response.data !== undefined || response.data !== null) {
                    saveInfo('jtoken', response.data);
                    saveInfo('user', values.username);
                    history.push('/portal');
                } else {
                    console.log('issue with login');
                    handleOpenSnack("UnAuthorized Attempt");
                    logout();
                }
            }).catch(err => {
                console.error('error in the login part!!!', err)
                setShowLoader(false);
                handleOpenSnack("Error at login Stage");
                logout();
            });
        } else {
            registerUser(values.username, values.password).then(response => {
                setShowLoader(false);
                if (response.data === "used") {
                    console.log('issue with login');
                    handleOpenSnack("Email Already in use");
                    logout();
                }
                else {
                    saveInfo('jtoken', response.data);
                    saveInfo('user', values.username);
                    history.push('/portal');
                }
            }).catch(err => {
                console.error('error in the login part!!!', err)
                setShowLoader(false);
                handleOpenSnack("Error at register Stage");
                logout();
            });
        }
    }

    const urlPath = 'url(https://cdn.dribbble.com/users/3274928/screenshots/6712339/dribbble-06.jpg)';

    return (
        <div style={{
            backgroundImage: urlPath, backgroundRepeat: 'no-repeat', backgroundPosition: 'center'
        }} id="login-section">
            <Box display="flex" justifyContent="center" m={1} p={1} style={{ margin: '90px auto' }}>
                <Box p={1}>
                    <Card style={{ border: '5px solid black' }}>
                        <CardActionArea>
                            <CardContent>
                                <Box display="flex" justifyContent="center" m={1} p={1}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <Chip
                                            icon={<FaceIcon />}
                                            label="User Login"
                                            color="primary"
                                            deleteIcon={<DoneIcon />}
                                        />
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="center" m={1} p={1}>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            value={values.username}
                                            onChange={handleChange('username')}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle email visibility"
                                                        edge="end"><EmailIcon /></IconButton></InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'email',
                                            }}

                                        />
                                    </FormControl>
                                </Box>
                                <Box display="flex" justifyContent="center" m={1} p={1}>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={values.showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            onChange={handleChange('password')}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }

                                        />
                                    </FormControl>
                                </Box>
                            </CardContent>
                            {showLoader && (<div className="spin"><ShopLoader></ShopLoader></div>)}
                        </CardActionArea>
                        <CardActions>
                            <Box display="flex" justifyContent="center" m={1} p={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<LockOpenIcon />}
                                    onClick={() => handleLogin("login")}
                                >
                                    Login
                                </Button>
                            </Box>
                            <Box display="flex" justifyContent="center" m={1} p={1}>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<ContactSupportIcon />}
                                    onClick={() => handleLogin("register")}
                                >
                                    Register
                                </Button>
                            </Box>
                        </CardActions>
                    </Card>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" m={1} p={1}>
                <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleCloseSnack} style={{ position: 'sticky' }}>
                    <Alert onClose={handleCloseSnack} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
            </Box>
        </div>)
}
export default Login;