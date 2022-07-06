import React from 'react';
import visa from '../../public/images/visa.png';

export const paymentOptions = [
  {
    label: <img src={visa} alt="Visa" />,
    value: 'stripe',
    labelStyle: {
      fontStyle: 'italic',
    },
  },
  {
    label: 'Invoice',
    value: 'invoice',
    leftIcon: 'fa fa-file-o',
  },
];
