import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Swal from 'sweetalert2';

// @mui
import { styled } from '@mui/material/styles';
import { Stack, IconButton, InputAdornment, TextField, Link, Container, Typography } from '@mui/material';

// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections 
import { Url } from '../url/url';



// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
    const mdUp = useResponsive('up', 'md');

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formValue, setFormValue] = useState({})
    const {id, otp} = useParams()
    const [errMsg, setErrMsg] = useState('')

    const formHandle = (e) => {
        const name = e.target.name
        const value = e.target.value 
        setFormValue({...formValue, [name]:value})
        
    }
    const handleClick = async(e) => {
        e.preventDefault();
        setErrMsg('')
        console.log("formValue", {...formValue, id, otp});
        if(!formValue.password){
            setErrMsg('New password is required')
            return true
        }
        if(!formValue.cpassword){
            setErrMsg('Confirm password is required')
            return true
        }
        if(formValue.password!== formValue.cpassword){
            setErrMsg('Password and Confirm password do not match')
            return true
        }
        try {
            const response = await axios.post(`${Url}/admin/resetPassword`, {...formValue, id, otp})
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Password has been reset',
                showConfirmButton: false,
                timer: 1500
              })
              navigate('/login')
        } catch (error) {
            console.log(error);
            if(error.response.status === 401) {
                console.log("error 401",error);
                setErrMsg(error.response.data.message) 
            }
        }
        
    return true
    }

    return (
        <>
            <Helmet>
                <title> Login | Toynique   </title>
            </Helmet>

            <StyledRoot>
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                />

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Hi, Welcome Back
                        </Typography>
                        <img src="/assets/illustrations/illustration_login.png" alt="login" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom className='mb-4'>
                            Reset Your Password
                        </Typography>
                        <p className='text-danger'>{errMsg}</p> 
                        <Stack spacing={3}> 
                            <TextField 
                                name="password"
                                label="New Password"
                                onChange={e => formHandle(e)}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }} 
                            />
                            <TextField

                                name="cpassword"
                                label="Confirm New Password"
                                onChange={e => formHandle(e)}
                                type={showConfirmPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }} 
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="end" sx={{ my: 2 }}> 
                            <Link variant="subtitle2" underline="hover" >
                                Go to Log In
                            </Link>
                        </Stack>
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
                            Reset
                        </LoadingButton>

                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
