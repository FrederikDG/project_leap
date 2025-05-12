// PieDataContainer.jsx
import React from "react";
import "../styles/PieDataContainer.css";

const PieDataContainer = ({ data, sliceColors }) => {
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0); // Calculate total budget
  return (
    <div className="pie__container">
      {data.map((item, index) => (
        <div key={index} className="pie__item">
          <div className="pie__label">
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: sliceColors[index],  // use the matching slice color
              }}
            />
            <h4>{item.name}</h4>
          </div>
          <p className="pie__data__value">{((item.budget / totalBudget) * 100).toFixed(0)}%</p>
        </div>
      ))}
    </div>
  );
};

export default PieDataContainer;
