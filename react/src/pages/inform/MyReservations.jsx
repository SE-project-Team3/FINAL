import React, { useEffect, useState } from 'react';
import useAuthGuard from '../../hooks/useAuthGuard';
import './inform.css';

function MyReservations() {
  useAuthGuard();

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    fetch(`/api/reservations?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const formatted = (data.reservations || []).map(r => ({
          id: r.reservation_id,
          name: localStorage.getItem('username') || '예약자',
          date: r.date,
          time: r.time || '미지정',
          people: r.guests,
          table: { label: r.table_id, position: r.location }
        }));
        setReservations(formatted);
      })
      .catch(err => console.error('예약 목록 불러오기 실패:', err));
  }, []);

  const handleCancel = async (res) => {
    const today = new Date();
    const resDate = new Date(res.date);

    today.setHours(0, 0, 0, 0);
    resDate.setHours(0, 0, 0, 0);

    const isSameDay = resDate.getTime() === today.getTime();
    const isPast = resDate.getTime() < today.getTime();

    if (isSameDay || isPast) {
      alert('24시간 이내에는 취소할 수 없습니다.');
      return;
    }

    if (!window.confirm('정말 이 예약을 취소하시겠습니까?')) return;

    try {
      const userId = localStorage.getItem('user_id');
      const resRaw = await fetch(`/api/cancel/${res.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const result = await resRaw.json();

      if (resRaw.ok) {
        alert('예약이 취소되었습니다.');
        setReservations((prev) => prev.filter((r) => r.id !== res.id));
      } else {
        alert(result.error || '예약 취소 실패');
      }
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="reservation-page">
      <h2>예약 확인</h2>
      {reservations.length === 0 ? (
        <p>예약 내역이 없습니다.</p>
      ) : (
        <div className="reservation-list">
          {reservations.map((res) => (
            <div className="reservation-card" key={res.id}>
              <div className="reservation-info">
                <p><strong>날짜/시간:</strong> {res.date} / {res.time}</p>
                <p><strong>예약자:</strong> {res.name}</p>
                <p><strong>인원:</strong> {res.people}명</p>
                <p><strong>테이블:</strong> {res.table.position} / {res.table.label}인석</p>
              </div>
              <div className="reservation-actions">
                <button onClick={() => handleCancel(res)} className="cancel-btn">
                  예약 취소
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservations;
