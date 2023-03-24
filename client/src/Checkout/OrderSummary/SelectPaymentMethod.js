import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './SelectPaymentMethod.css'

export default function SelectPaymentMethod(props) {
    const { paymentMethod, setPaymentMethod } = props;

  const handleRadioChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <form className="select-payment-root">
      <FormControl className="select-payment-form-ctrl" variant="standard">
        <FormLabel sx={{ fontSize: "20px", fontFamily: 'Fredoka' }} >Select a Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={handleRadioChange}
          className="select-payment-radios"
        >
          <FormControlLabel value="instore" control={<Radio />} label="Pay in Store" />
          <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
        </RadioGroup>
      </FormControl>
    </form>
  );
}
