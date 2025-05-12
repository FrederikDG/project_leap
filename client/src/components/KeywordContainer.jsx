import React from "react";
import "../styles/KeywordContainer.css"; // Assuming you have a CSS file for styling
const KeywordContainer = ({ keyword, impressions, click, cpc }) => {

  return (
    <div className="keyword__container">
        <h4 className="keyword__word">{keyword}</h4>
        <p className="keyword__impressions">{impressions?.toLocaleString()}</p>
        <p className="keyword__click">{click?.toLocaleString()}</p>
        <p className="keyword__cpc">{cpc?.toLocaleString()}</p>
    </div>
  );
};

export default KeywordContainer;
