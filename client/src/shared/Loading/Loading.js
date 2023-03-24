import * as React from 'react';
import './Loading.css'

const Loading = (props) => {

    return (
        <div className='loading'>
            <div className='loading-box'>
                <div className='loading-pepe' />
                {props.description}
            </div>
        </div>
    );
}

export default Loading;