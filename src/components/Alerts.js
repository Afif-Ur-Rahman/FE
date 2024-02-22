import React from "react";

const Alerts = (props) => {
  return (
    <div style={{position: "fixed", top: "0", height: "50px", width: "100%", }}>
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {props.alert.msg}
        </div>
      )}
    </div>
  );
};

export default Alerts;
