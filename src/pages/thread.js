import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/thread.module.css';
import { useUserStore } from '../store/userStore'; // ✅ zustand에서 가져오기

// 👇 MockAPI 엔드포인트
const MOCK_API_URL = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isAnon: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Zustand에서 로그인한 사용자 이름 가져오기
  const username = useUserStore((state) => state.name);

  /** ✏️ 입력값 변경 핸들러 */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /** 🕹 익명 토글 핸들러 */
  const handleAnonToggle = () => {
    setFormData((prev) => ({ ...prev, isAnon: !prev.isAnon }));
  };

  /** 📨 axios로 게시물 등록 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    const newPost = {
      title: formData.title,
      content: formData.content,
      isAnon: String(formData.isAnon), // ⚠ MockAPI 문자열로 전송
      author: formData.isAnon ? '익명' : username || '작성자없음',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    try {
      const res = await axios.post(MOCK_API_URL, newPost);
      console.log('서버 응답:', res.data);
      alert('✅ 게시물이 성공적으로 등록되었습니다!');
      navigate('/mypage');
    } catch (error) {
      console.error('게시물 등록 중 오류:', error);
      alert('⚠ 게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Hanstagram</h1>
      <h2>글 남기기</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
            className={styles.input}
          />
        </div>

        {/* 내용 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            required
            rows="10"
            className={styles.textarea}
          />
        </div>

        {/* 익명 옵션 */}
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={formData.isAnon}
              onChange={handleAnonToggle}
            />
            익명으로 게시하기
          </label>
        </div>

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? '게시 중...' : '게시하기'}
        </button>
      </form>
    </div>
  );
}
