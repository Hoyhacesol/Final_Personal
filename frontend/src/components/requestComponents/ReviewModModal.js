import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../../css/ReviewModal.css';

const ReviewModModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      // 백엔드에서 받은 정수 평점을 UI용 소수점 평점으로 변환
      setRating(initialData.rating ? initialData.rating / 2 : 0);
      setComment(initialData.rcontent || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleClick = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const newRating = x < width / 2 ? index - 0.5 : index;
    setRating(newRating);
  };

  const renderStar = (starIndex) => {
    if (rating >= starIndex) {
      return <FaStar className="star filled" />;
    } else if (rating >= starIndex - 0.5) {
      return <FaStarHalfAlt className="star half" />;
    } else {
      return <FaRegStar className="star empty" />;
    }
  };

  const handleSubmit = () => {
    const intRating = Math.round(rating * 2);
    onSubmit({ rating: intRating, rcontent: comment });
    onClose();
  };

  const isCommentValid = comment.trim().length >= 5;

  return (
    <div className="rm_overlay" onClick={onClose}>
      <div className="rm_content" onClick={e => e.stopPropagation()}>
        <h3>리뷰 수정</h3>
        <div className="rm_stars">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="rm_star-wrapper" onClick={e => handleClick(e, i)}>
              {renderStar(i)}
            </div>
          ))}
        </div>
        <textarea
          className="rm_textarea preserve-lines"
          placeholder="리뷰를 작성해주세요. (최소 5글자)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        {!isCommentValid && comment.length > 0 && (
          <p className='rm_msg'>리뷰는 최소 5글자 이상 입력해야 합니다.</p>
        )}
        <div className="rm_actions">
          <button className="rm_btn cancel" onClick={onClose}>취소</button>
          <button className="rm_btn submit" onClick={handleSubmit} disabled={rating === 0 || !isCommentValid}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModModal;

