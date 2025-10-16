import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/thread.module.css';
import { useUserStore } from '../store/userStore'; // ✅ zustand에서 가져오기

// 👇 MockAPI 엔드포인트 (리소스 이름이 post 라고 가정)
const MOCK_API_URL = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

// 🧱 파일 상단 밖으로 빼기!
function InputField({ id, label, value, onChange, placeholder, required }) {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );
}


export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isAnon: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Zustand에서 현재 로그인한 사용자 이름 가져오기
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
      isAnon: String(formData.isAnon), // ⚠ MockAPI 스키마에 따라 문자열로 전송
      author: formData.isAnon ? '익명' : username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    try {
      const res = await axios.post(MOCK_API_URL, newPost);
      console.log('서버 응답:', res.data);

      alert('게시물이 성공적으로 등록되었습니다!');
      navigate('/mypage');
    } catch (error) {
      console.error('게시물 등록 중 오류 발생:', error);
      alert('게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /** 🧱 재사용 가능한 입력 필드 */
  const InputField = ({ id, label, placeholder, required }) => (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={formData[id]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={styles.input}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      <h1>ℌ𝔞𝔫𝔰𝔱𝔞𝔯𝔤𝔯𝔞𝔪</h1>
      <h2>글 남기기</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="title" style={{ color:'black', display: 'block', fontWeight: 'bold', margin:0, padding:0}}>
            제목
          </label>  
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
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
