import React, { useEffect, useRef } from 'react';
import './styles/modal.css';

export default function Modal({ isOpen, close, children }) {

 
    const handleClick = (event) => {
        event.stopPropagation();
    }

    return (
        <article className={isOpen ? 'modal is-open' : 'modal'} >
            <button
                className="modal-close"
                onClick={() => { close() }}
            >X</button>
            <div className="modal-container"  onClick={handleClick}>
                {children}
            </div>
        </article>
    );
}