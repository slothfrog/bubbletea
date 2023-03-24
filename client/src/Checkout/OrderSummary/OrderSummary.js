import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import SelectLocationAndTime from './SelectLocationAndTime/SelectLocationAndTime';
import SelectPaymentMethod from './SelectPaymentMethod';
import './OrderSummary.css'
import { paymentApi } from '../../api/PaymentAPI.js';
import { styled } from '@mui/material/styles';

import pepeActive from '../../shared/media/stepper-pepe-active.png';
import pepeCompleted from '../../shared/media/stepper-pepe-completed.jpg';
import pepeGrey from '../../shared/media/stepper-pepe-grey.jpg';

const StepIconRoot = styled('div')(({ ownerState }) => ({
  backgroundImage: `url(${pepeGrey})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: 30,
  height: 30,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: `url(${pepeActive})`,
  }),
  ...(ownerState.completed && {
    backgroundImage: `url(${pepeCompleted})`,
  }),
}));

function StepIcon(props) {
  const { active, completed, className } = props;
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}/>
  );
}

const OrderSummary = (props) => { 
  const locations = props.locations

  const [activeStep, setActiveStep] = React.useState(0);
  const [paymentMethod, setPaymentMethod] = React.useState('instore');
  let current_time = new Date();
  const post_15_min = new Date(current_time.getFullYear(), current_time.getMonth(), current_time.getDate(), current_time.getHours(), current_time.getMinutes()+15)
  const [dateTime, setDateTime] = React.useState(post_15_min);
  const [isInvalidTime, setIsInvalidTime] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState(locations[0]);
  let steps = ['Location & Time', 'Payment Method'];
  if ( paymentMethod === 'credit') {
      steps = [...steps, 'Pay'];
    }

  
  const handleTimeChange = (newValue) => {
      setDateTime(newValue);
      setIsInvalidTime(false)
  };

  const handleLocationChange = (event) => {
    const name = event.target.value;
    const location = locations.filter((l)=>{return l.name === name})
    setSelectedLocation(location[0]);
  }

  const handleNext = () => {
    if(isInvalidTime) return
    if(!isLastStep()){
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else{
      paymentApi.pay(props.orderId, paymentMethod, selectedLocation._id, dateTime,  function(err, data){
        if(err){
          window.location.replace(process.env.REACT_APP_CLIENT_URL+"/error/"+props.orderId);
          props.updateOrders(true)
        }
        if(paymentMethod==="paypal"){
          props.setIsRedirecting(true)
          const redirect = JSON.parse(data).redirect
          window.location.href = redirect;
        } else {
          // instore
          window.location.replace(process.env.REACT_APP_CLIENT_URL+"/success/"+props.orderId);
          props.updateOrders(true)
        }
      })
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isLastStep = () => {
    if(activeStep === steps.length - 1) {
      return true
    }
    return false
  }

  const getNextBtnText = () => {
    if(isLastStep()) {
      if(paymentMethod==="instore") return "Confirm"
      if(paymentMethod==="paypal") return "Confirm & Pay"
      return "Pay"
    }
    return "Next"
  };

  const components = [SelectLocationAndTime, SelectPaymentMethod]
  const componentProps = [{...props, locations, dateTime, setIsInvalidTime, handleTimeChange, selectedLocation, handleLocationChange}, {paymentMethod, setPaymentMethod: setPaymentMethod}, ]
  const Component = components[activeStep];

    return ( 
        <div className='order-summary'>
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} >
        {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon} sx={{ 
                              '& .MuiStepLabel-label': {
                                fontFamily: 'Fredoka',
                                fontSize: '18px'
                              }, }} >{label}</StepLabel>
            </Step>
          )
        )}
      </Stepper>
        <React.Fragment>
          <Component {...componentProps[activeStep]} />
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, fontFamily: "Fredoka" }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />

            <Button onClick={handleNext} sx={{fontFamily: "Fredoka"}}>
              {getNextBtnText()}
            </Button>
          </Box>
        </React.Fragment>
    </Box>
        </div>
    )
}

export default OrderSummary;