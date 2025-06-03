import React from 'react';
import ShowData from './ShowData';
import baseurl from '../Url';

function Dominos() {

  return <ShowData apiEndpoint={`${baseurl}/dominos_data`}  shopName="dominos"/>;
}

export default Dominos;
