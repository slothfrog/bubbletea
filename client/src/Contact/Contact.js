import '../shared/style/Form.css'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const form = React.useRef();
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
      const navigate = useNavigate();

      const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_ujjtpi1', 'template_w8byod9', form.current, 'S2KgNYiCwhud_7MUf')
          .then((result) => {
              navigate('/contact/success')
          }, (error) => {
              console.log(error.text);
              navigate('/contact/error')
          });
        
      };

    return ( 
        <div className="form-background">
            <form ref={form} onSubmit={sendEmail}>
                <Item className='paper-form' elevation={24}>
                    <div className="form-title">
                        Contact Us
                    </div>
                    <div className="form-inputs">
                        <input className='input' type="input" id="contact_name" name="contact_name" placeholder='Name*' required></input>
                        <input className='input' type="email" id="contact_email" name="contact_email" placeholder='Email*' required></input>
                        <textarea rows={10} className='input' type="text" id="contact_content" name="contact_content" placeholder='Message'></textarea>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className='form-btn'>Send Message</button>
                    </div>
                </Item>
            </form>
        </div>
     );
}
 
export default Contact;