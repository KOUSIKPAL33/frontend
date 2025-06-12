import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

function Showorders() {
  return (
    <div style={{ backgroundColor: "#f1f3f6", marginTop: '5rem', width: "max-content" }} className='container'>
     <h1
          className="text-center fw-bold fs-1 text-primary"
          style={{
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            letterSpacing: "1px",
            marginBottom: "30px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        ><FontAwesomeIcon icon={faReceipt} className="me-2" />  New Orders
      </h1>
    </div>
  )
}

export default Showorders
