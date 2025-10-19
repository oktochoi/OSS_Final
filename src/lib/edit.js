import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/CreatePost.module.css'; // CreatePost의 스타일 재사용

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [isAnon, setAnon] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { postId } = useParams(); // URL에서 postId 파라미터 가져오기
  const navigate = useNavigate();

  const MOCK_API_URL = `https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram/${postId}`;

  // 컴포넌트가 마운트될 때 기존 게시물 데이터를 불러옵니다.
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(MOCK_API_URL);
        if (!response.ok) {
          throw new Error('게시물 정보를 불러오지 못했습니다.');
        }
        const data = await response.json();
        setTitle(data.title);
        setImage(data.image);
        setContent(data.content);
        setAnon(data.isAnon);
      } catch (error) {
        console.error(error);
        alert(error.message);
        navigate('/mypage'); // 에러 발생 시 마이페이지로 이동
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
  }, [MOCK_API_URL, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedPost = { title, image, content, isAnon};

    try {
      const response = await fetch(MOCK_API_URL, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('게시물 수정에 실패했습니다.');
      }
      alert('게시물이 성공적으로 수정되었습니다.');
      navigate('/mypage'); // 수정 완료 후 마이페이지로 이동
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>게시물 수정</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title" type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">이미지 URL</label>
          <input
            id="image" type="url" value={image}
            onChange={(e) => setImage(e.target.value)} required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content" value={content}
            onChange={(e) => setContent(e.target.value)} required rows="10"
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">익명표시</label>
          <input 
            type = "checkbox"
            id="isAnon"
            checked={isAnon}
            onChange={(e) => setAnon(e.target.checked)}
            className={styles.checkbox}
          />
        </div>
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? '수정 중...' : '수정 완료'}
        </button>
      </form>
    </div>
  );
}