import React from 'react'

function Loading() {
    return (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999 }}>
            <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default Loading
