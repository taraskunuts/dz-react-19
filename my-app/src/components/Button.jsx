// src/components/Button.jsx
import React from 'react';

function Button({ onClick }) {
  return (
    <button className="load-more" onClick={onClick}>
      Load more
    </button>
  );
}

export default Button;