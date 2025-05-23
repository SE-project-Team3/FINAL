const tables = [
  { id: 1, label: '6', position: 'window', available: true, shape: 'square', row: 1, col: 1 },
  { id: 2, label: '2', position: 'window', available: true, shape: 'square', row: 4, col: 1 },
  { id: 3, label: '2', position: 'window', available: true, shape: 'square', row: 5, col: 1 },
  { id: 4, label: '2', position: 'window', available: true, shape: 'square', row: 6, col: 1 },

  { id: 5, label: '6', position: 'hall', available: true, shape: 'square', row: 4, col: 3 },
  { id: 6, label: '4', position: 'hall', available: true, shape: 'square', row: 5, col: 5 },

  { id: 7, label: '1', position: 'bar', available: true, shape: 'circle', row: 2, col: 3 },
  { id: 8, label: '1', position: 'bar', available: true, shape: 'circle', row: 2, col: 4 },
  { id: 9, label: '1', position: 'bar', available: true, shape: 'circle', row: 2, col: 5 },

  { id: 10, label: '8', position: 'room', available: true, shape: 'square', row: 2, col: 7 },
  { id: 11, label: '2', position: 'room', available: true, shape: 'square', row: 5, col: 7 },
  { id: 12, label: '2', position: 'room', available: true, shape: 'square', row: 6, col: 7 }
];

export default tables;


//available 은 예약 가능 불가능 표시 더미 데이터로 테스트