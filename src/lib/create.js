import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreatePost.module.css';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(''); // 이미지 URL을 저장할 상태
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const MOCK_API_URL = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram'; //mockAPI 주소

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지

    if (isLoading) return; // 이미 제출 중이면 중복 실행 방지
    setIsLoading(true);

    // API로 보낼 새로운 게시물 데이터 객체
    const newPost = {
      title,
      image,
      content,
      createdAt: new Date().toISOString(), // 현재 시간을 ISO 형식으로 저장
      likes: 0, // 새 게시물이므로 '좋아요'는 0으로 시작
      isAnon: false //일단 익명 선택은 나중에 
    };

    try {
      const response = await fetch(MOCK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('데이터 전송에 실패했습니다.');
      }

      alert('게시물이 성공적으로 등록되었습니다!');
      navigate('/mypage'); // 성공 시 홈으로 이동
      
    } catch (error) {
      console.error('게시물 등록 중 오류 발생:', error);
      alert('게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  return (
    <div className={styles.container}>
      <h1> Hastagram </h1>
      <h2>새 게시물 만들기</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">이미지 URL</label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="이미지 주소를 붙여넣으세요"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="캡션 추가..."
            required
            rows="10"
            className={styles.textarea}
          />
        </div>
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? '게시 중...' : '게시하기'}
        </button>
      </form>
    </div>
  );
}