import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useMutation } from '@apollo/react-hooks';
import { createUser, signInUser } from '../../api/LoginAPI';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GoogleButton from 'react-google-button';

const SignUp = (props) => {
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
    const [newUser, {loading}] = useMutation(createUser,{ errorPolicy: 'all' });
    const navigate = useNavigate();
    const [error, setError] = useState(undefined);
    const [signin] = useMutation(signInUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target["signup-username"].value;
        const password = e.target["signup-password"].value;
        const email = e.target["signup-email"].value;
        let response = await newUser({
            variables: {name: username, password: password, email: email},
        });
        if(!response.errors) {
            signin({
                variables:{email: email, password: password},
            }).then(
                ()=> {
                    props.onLogin();
                    navigate('/');
                }
            );
        }
        else {
            setError(response.errors[0].message)
        }
    }

    const handleGoogleClick = () => {
        window.location.href = process.env.REACT_APP_SERVER_URL + "/rest/oauth/google/register";
    }

    return ( 
        <div className="form-background">
            {!loading && <form className='form' onSubmit={handleSubmit}>
                <div className="signin-form">
                    <Item className='paper-form' elevation={24} sx={{maxWidth:"450px"}}>
                        <div className="form-title">
                            Sign Up
                        </div>
                        <div className="form-inputs">
                            <input className='input' type="text" id="signup-username" name="signup-username" placeholder='Name' required></input>
                            <input className='input' type="text" id="signup-email" name="signup-email" placeholder='Email' required></input>
                            <input className='input' type="password" id="signup-password" name="signup-password" placeholder='Password' required></input>
                        </div>
                        {error && <div className="error">{error}</div>}
                        <div className="form-buttons">
                            <button type="submit" className='form-btn big-btn signup'>Create Account</button>
                        </div>
                        <div className="divider-top divider"></div>
                        <div className='divider-label'>Or</div>
                        <GoogleButton className="google" label={"Sign up with Google"} onClick={handleGoogleClick}></GoogleButton>
                        <div className="divider-top divider"></div>
                        <div className='divider-label'>
                            Already have an account? 
                        </div>
                            <Link to="/sign-in">
                                <button className='form-btn big-btn new-account'>Go to Login Page</button>
                            </Link>
                        
                    </Item>
                </div>

            </form>}
        </div>
         );
}
 
export default SignUp;