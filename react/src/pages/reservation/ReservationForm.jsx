import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Reservation.css';
import useAuthGuard from '../../hooks/useAuthGuard';

function ReservationForm() {
  useAuthGuard();
  const location = useLocation();
  const table = location.state?.table;
  const navigate = useNavigate();
  const initialPeople = location.state?.people ?? 1;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    card: '',
    people: initialPeople,
  });

  // 로그인된 유저 정보 가져오기
  useEffect(() => {
    const savedName = localStorage.getItem('username');
    const savedPhone = localStorage.getItem('userphone');
    if (savedName) {
      setFormData((prev) => ({ ...prev, name: savedName }));
    }
    if (savedPhone) {
      setFormData((prev) => ({ ...prev, phone: savedPhone })); 
    }
  }, [table]);
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 카드 번호 포맷 자동화
  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join('-') || '';
    setFormData((prev) => ({ ...prev, card: formatted }));
  };

  const handlePeopleChange = (delta) => {
    const newCount = formData.people + delta;
    if (newCount < 1) return;
    if (newCount > Number(table.label)) {
      alert(`이 테이블은 최대 ${table.label}명까지 수용 가능합니다.`);
      return;
    }
    setFormData((prev) => ({ ...prev, people: newCount }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.people > Number(table.label)) {
    alert(`선택한 테이블은 ${table.label}인석입니다. 인원 수를 줄여주세요.`);
    return;
  }

  const payload = {
    user_id: localStorage.getItem('user_id'),
    table_id: table.id,
    date: location.state.date,
    time: location.state.time,
    guests: formData.people,
    name: formData.name,     
    phone: formData.phone,   
    card: formData.card     
  };

  try {
    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('예약 실패');
    alert('예약이 성공적으로 완료되었습니다.');
    navigate('/home');
  } catch (err) {
    console.error(err);
    alert('예약 중 오류가 발생했습니다.');
  }
};



  return (
    <div className="reservation-form-page">
      <h2>{table.label}인 좌석 ({table.position}) 예약</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>전화번호</label>
        <input
          type="tel"
          name="phone"
          placeholder="전화번호"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>신용카드 번호</label>
        <input
          type="text"
          name="card"
          placeholder="1234-5678-1234-1234"
          value={formData.card}
          onChange={handleCardChange}
          required
        />

        <label>예약 인원</label>
        <div className="people-select">
          <button type="button" onClick={() => handlePeopleChange(-1)}>-</button>
          <span>{formData.people}</span>
          <button type="button" onClick={() => handlePeopleChange(1)}>+</button>
        </div>

        <button type="submit">예약하기</button>
      </form>
    </div>
  );
}

export default ReservationForm;