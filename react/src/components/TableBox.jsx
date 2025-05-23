import React from 'react';
import './TableBox.css';

function TableBox({ table, onClick }) {
  const isCircle = table.shape === 'circle';
  const baseSize = 100;
  const multiplier = Number(table.label) / 2;

  let width, height;

  switch (table.position) {
    case 'hall':
      if(table.label === '6')
        height = baseSize * 3.2
      else
        height = baseSize * multiplier;
      width = baseSize * 1.5;
      break;

    case 'window':
      width = baseSize * 1.5;
      if(table.label === '6')
        height = baseSize * 3.2
      else
        height = baseSize * multiplier;
      break;

    case 'bar':
      width = baseSize;
      height = baseSize;
      break;

    case 'room':
      if(table.label === '8'){
        height = baseSize * 3.2
        width = baseSize * 2;
      }
        
      else{
        height = baseSize * multiplier;
        width = baseSize * 1.5;
      }
      break;

    default:
      width = baseSize;
      height = baseSize;
      break;
  }

  return (
    <div
      className={`table-box ${!table.available ? 'reserved' : ''} ${isCircle ? 'circle' : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={() => table.available && onClick(table)}
    >
      <div className="table-label">{table.label}인</div>
    </div>
  );
}

export default TableBox;