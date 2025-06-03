import React from 'react';
import ShowData from './ShowData';
import baseurl from '../Url';

function Yummpy() {
  return <ShowData apiEndpoint={`${baseurl}/yummpy_data`}/>;

}

export default Yummpy
