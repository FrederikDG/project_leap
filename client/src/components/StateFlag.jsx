import React from "react";
import "../styles/StateFlag.css";
export default function StateFlag({ type, state }) {
return (
    <>
        {type === "campaign" ? (
            <div className={`flag__container ${type}`}>
                <img className="icon" src="./LIGHTNING.svg" alt="lightning" />
                <p>campaign {state}</p>
            </div>
        ) : type === "flight" ? (
            <div className={`flag__container ${type}`}>
                <p>{state} flights</p>
            </div>
        ) : null}
    </>
);
}
