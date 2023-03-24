import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { signInUser } from '../../api/LoginAPI';
import './SignIn.css';
import GoogleButton from 'react-google-button';

const SignIn = (props) => {
    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: "fit-content",
        lineHeight: '60px',
        border: "1px solid black",
        borderRadius: "15px",
        paddingBottom: "2vw",
    }));

    const [errorVisible, setErrorVisible] = useState(false);
    const [signin] = useMutation(signInUser);
    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
        const password = e.target["signin-password"].value;
        const email = e.target["signin-email"].value;
        signin({
            variables:{email: email, password: password},
        }).then(
            ()=> {
                props.onLogin();
                navigate('/');
            },
            ()=> {
                setErrorVisible(true);
            }
        );
    }

    const handleGoogleClick = () => {
        window.location.href = process.env.REACT_APP_SERVER_URL + "/rest/oauth/google/login";
    }
    return (
        <div className="form-background">
            <form className="form" onSubmit={handleSubmit}>
                <div className="signin-form">
                    <Item className='paper-form' elevation={24} sx={{maxWidth: "450px"}}>
                        <div className="form-title">
                            Sign In
                        </div>
                        <div className="form-inputs">
                            <input className='input' type="text" id="signin-email" name="signin-email" placeholder='Email' required></input>
                            <input className='input' type="password" id="signin-password" name="signin-password" placeholder='Password' required></input>
                        </div>
                        <div className='error'>
                            {errorVisible && <div className="error-message">Invalid Username/Password</div>}
                        </div>
                        <div className="form-buttons">
                            <button className='form-btn big-btn login' type="submit">Login</button>
                        </div>
                        
                        <div className="divider-top divider"></div>
                        <div className='divider-label'>Or</div>
                        
                        <GoogleButton className='google' onClick={handleGoogleClick}></GoogleButton>
                        <div className="divider-top divider"></div>
                        <div className='divider-label'>New to Pepe's Bubbles?</div>
                        <div className='form-buttons'>
                            <Link to={"/sign-up"}>
                                <button className='form-btn big-btn new-account'>Create a New Account</button>
                            </Link>
                        </div>
                    </Item>
                </div>

            </form>
        </div> );
}
 
export default SignIn;