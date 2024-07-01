// Modal.stories.js

import React, { useState } from 'react';
import Modal from '../components/Modal';
//import '../components/styles/modal.css';

export default {
  title: 'Components/Modal',
  component: Modal,
};

const Template = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal {...args} isOpen={isOpen} close={close}>
        <p>This is the modal content</p>
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpen: false,
};

export const Open = Template.bind({});
Open.args = {
  isOpen: true,
};
