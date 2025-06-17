import React from 'react';

function Myorderscard({ imgSrc, itemName, price, quantity,totalPrice }) {
  return (
    <div className='d-flex bg-white border rounded p-2 shadow-sm' style={{ width: "20rem" }}>
      <div>
        <img
          src={'./' + imgSrc}
          alt={itemName}
          style={{ width: '140px', height: '120px', paddingRight: '8px' }}
        />
      </div>
      <div className='d-flex flex-column justify-content-around'>
        <p className='mb-1'><strong>{itemName}</strong></p>
        
          <p className='mb-0'><strong>Price: ₹</strong>{price}</p>
          <p className='mb-1'><strong>Qty:</strong> {quantity}</p>
        <p className='mb-0'><strong> Total : ₹</strong>{totalPrice}</p>
      </div>
    </div>
  );
}

export default Myorderscard;
