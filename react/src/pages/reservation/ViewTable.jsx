import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TableBox from '../../components/TableBox';
import tables from '../../data/TableData';
import './Reservation.css';
import useAuthGuard from '../../hooks/useAuthGuard';

function ViewTable() {
  useAuthGuard();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reservedIds, setReservedIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { date, time, people } = location.state || {};

  const timeMap = { '점심': 'lunch', '저녁': 'dinner' };
  const apiTime = timeMap[time] || time;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch(`/api/tables?date=${date}&time=${apiTime}`);
        const data = await res.json();
        setReservedIds(data.reserved_table_ids || []);
      } catch (err) {
        console.error('테이블 정보 불러오기 실패:', err);
      }
    };
    if (date && time) fetchTables();
  }, [date, time]);

  const handleReserveClick = (table) => {
    if (!table.available) return;
    setSelectedTable(table);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedTable(null);
    setShowModal(false);
  };

  return (
    <div className="table-layout-wrapper">
      <div className="info-banner-fixed">
        <span>날짜: {date}</span>
        <span> / 시간: {time}</span>
        <span> / 인원: {people}명</span>
      </div>

      <div className="table-layout">
        <div className="room-area-outline"><span className="label">ROOM</span></div>
        <div className="bar-area">BAR</div>
        <div className="window-wall"><span className="label-vertical">WINDOW</span></div>

        <div className="table-grid">
          {tables.map((table) => {
            const canUse = Number(table.label) >= Number(people);
            const isReserved = reservedIds.includes(table.id);
            return (
              <div key={table.id} style={{ gridRow: table.row, gridColumn: table.col }}>
                <TableBox
                  table={{ ...table, available: !isReserved && canUse }}
                  onClick={handleReserveClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selectedTable && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content modal-custom" onClick={(e) => e.stopPropagation()}>
            <h2>테이블 정보</h2>
            <p>수용 인원: <strong>{selectedTable.label}명</strong></p>
            <p>위치: <strong>{
              selectedTable.position === 'hall' ? '홀(Hall)' :
              selectedTable.position === 'window' ? '창가(Window)' :
              selectedTable.position === 'bar' ? '바(Bar)' :
              selectedTable.position === 'room' ? '룸(Room)' :
              selectedTable.position
            }</strong></p>

            <div className="modal-button-group">
              <button
                className="modal-button"
                onClick={() =>
                  navigate('/reservation-form', {
                    state: { 
                      table: selectedTable,
                      people: people,
                      date: date,     
                      time: apiTime
                    }
                  })
                }
              >
                예약하기
              </button>
              <button className="modal-cancel" onClick={handleClose}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTable;
