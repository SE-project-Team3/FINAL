import React from 'react';
import './Home.css';
import info_img from '../../assets/info.jpg';

const InfoPage = () => {
  return (
    <div className="info-page">
      <div className="info-image">
        <img src={info_img} alt="레스토랑" />
      </div>

      <div className="restaurant-details">
        <h2>예약 안내</h2>
        <p>예약은 <strong>1개월 이내</strong>로 제한됩니다.</p>
        <p>예약 취소는 예약일 <strong>하루 전</strong>까지만 가능합니다.</p>
        <p>점심 예약은 <strong>당일 11시</strong>, 저녁 예약은 <strong>당일 17시</strong>까지로 제한됩니다.</p>
        <br></br>
        <br></br>
        <h2>레스토랑 안내</h2>
        <p><strong>주소:</strong> 서울특별시 중구 필동로 1길 30</p>
        <p><strong>전화번호:</strong> 02-1234-5678</p>
        <p><strong>운영시간:</strong> 매일 11:00 ~ 22:00</p>
        <p><strong>휴무일:</strong> 연중무휴</p>
      </div>
    </div>
  );
};

export default InfoPage;
