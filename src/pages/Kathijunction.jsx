import React from 'react';
import ShowData from './ShowData';
import baseurl from '../Url';

function Kathijunction() {
  
  return <ShowData apiEndpoint={`${baseurl}/kathijunction_data`}/>;
}

export default Kathijunction;
