import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Swal from 'sweetalert2';
// components
import Iconify from '../../../components/iconify';
import { Url } from '../../../url/url';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const resetTime = 60
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({})
  const [infoMsg, setInfoMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [resetPasswordTimer, setResetPasswordTimer] = useState(0)
  const forgetTimerId = useRef(null);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false);
  const formHandle = (e) => {
    setInfoMsg('')
    setErrorMsg('')
    const name = e.target.name
    const value = e.target.value
    setFormValue({ ...formValue, [name]: value })
  }
  const handleClick = async () => {
    setErrorMsg('') 
    setLoading(true)
    if(!formValue.email) {
      setLoading(false)
      setErrorMsg('Please enter a valid email') 
      return
    }
    if(!formValue.password) {
      setLoading(false)
      setErrorMsg('Please enter password') 
      return
    }
    const { email, password } = formValue 
    if (email && password) {
      try {
        await axios.post(`${Url}/admin/login`, formValue).then((e) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'log in Success',
            showConfirmButton: false,
            timer: 1500
          })
          setLoading(false)

          const admin = JSON.stringify((e.data.responsedata));
          const token = e.data.token
          localStorage.setItem("token", token);
          localStorage.setItem("admin", admin);
          navigate("/dashboard")
        })
      } catch (error) {
        console.log(error);
        setLoading(false)
        if(error.response.status === 401) {
          setErrorMsg(error.response.data.message)
        }
      }
    }
    else {
      setLoading(false)
      Swal.fire('All fields are required')
    }
     
  };
  const startForgetTimer = () => { 
    forgetTimerId.current = setInterval(() => {
      setResetPasswordTimer((prevTimer) => {
        if (prevTimer - 1 < 1) { 
          setResetPasswordLoading(false)
          clearInterval(forgetTimerId.current);  
          return 0;  
        } 
        return prevTimer - 1;  
      });
    }, 1000);
  };   
  useEffect(() => { 
    if (resetPasswordTimer === resetTime) {
      startForgetTimer()
    }  
  }, [resetPasswordTimer]);


  const forgetPassword = async (e) => {
    e.preventDefault()
    setInfoMsg('')
    setResetPasswordLoading(true)
    try {
      const response = await axios.get(`${Url}/admin/forget-password`) 
      setResetPasswordTimer(resetTime)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Mail has sent',
        showConfirmButton: false,
        timer: 1500
      })
      setInfoMsg('A password reset link has been sent to your email. Please check your inbox to proceed.') 
    } catch (error) {
      console.log(error);
      if(error.response.status === 401) {
        setInfoMsg(error.response.data.message)
      }
      setResetPasswordLoading(false)
    }
  }

  const auth = localStorage.getItem("token");

  useEffect(() => {
    if (auth) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth])
  return (
    <>
      {!auth ?
        <>
          <Stack spacing={3}>
            <p className='text-primary'>{infoMsg}</p>
            <p className='text-danger'>{errorMsg}</p>
            <TextField name="email" type='email' label="Email address" onChange={e => formHandle(e)} />

            <TextField

              name="password"
              label="Password"
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
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="end" sx={{ my: 2 }}> 
          <p className='mb-0 me-4 fs-12'>{resetPasswordTimer <= 0 ? null : `Remaining time : ${resetPasswordTimer}` } </p> 
            <Button variant="subtitle2" underline="hover" disabled={resetPasswordLoading} onClick={e => forgetPassword(e)} >
              Forgot password?
            </Button>
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} disabled={loading}>
            Login
          </LoadingButton>
        </>
        : null}
    </>
  );
}
