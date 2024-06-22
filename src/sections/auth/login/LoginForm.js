import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Swal from 'sweetalert2';
// components
import Iconify from '../../../components/iconify';
import { Url } from '../../../url/url';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState()

  const [showPassword, setShowPassword] = useState(false);
  const formHandle = (e)=>{
    const name = e.target.name
    const value = e.target.value 
    setFormValue({...formValue , [name]:value}) 
  }
  const handleClick = async() => {
    const {email, password} = formValue
    if(email && password){
      try {
        await axios.post(`${Url}/admin/login`, formValue).then((e)=>{
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'log in Success',
                showConfirmButton: false,
                timer: 1500
            })
            
            const admin =  JSON.stringify((e.data.responsedata));
            const token = e.data.token 
            localStorage.setItem("token", token);
            localStorage.setItem("admin", admin);
            navigate("/dashboard")
        })
    } catch (error) {
        console.log(error);
    }
    }
    else{
      Swal.fire('All fields are required')
    }
    // navigate('/dashboard', { replace: true });
  };

  const auth = localStorage.getItem("token");

  useEffect(()=>{
    if(auth){
      navigate('/dashboard', { replace: true });
    }
  }, [auth])
  return (
    <>
    {!auth ?
    <>
      <Stack spacing={3}>
        <TextField name="email" type='email' label="Email address" onChange={e=>formHandle(e)} />

        <TextField

          name="password"
          label="Password"
          onChange={e=>formHandle(e)}
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
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
      </>
      : null }
    </>
  );
}
