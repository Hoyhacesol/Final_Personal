import { useEffect } from 'react';

const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    const body = document.body;
    const originalStyle = window.getComputedStyle(body).overflow;

    if (isLocked) {
      // 스크롤바 너비를 계산하여 레이아웃 밀림 방지
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      body.style.overflow = originalStyle;
      body.style.paddingRight = '0px';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      body.style.overflow = originalStyle;
      body.style.paddingRight = '0px';
    };
  }, [isLocked]);
};

export default useBodyScrollLock;

