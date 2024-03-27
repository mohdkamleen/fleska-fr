import { Spin } from 'antd'
import React from 'react'

const Loading = () => {
    return (
        <div style={{
            height: "100vh",
            width: "100%",
            background: "rgba(255,255,255,0.3)",
            position: "fixed",
            top: "0",
            left:0,
            zIndex: "9999",
            display:"grid",
            placeItems:"center",
            backdropFilter:"blur(5px)"
        }}>
            <Spin spinning={true} />
        </div>
    )
}

export default Loading