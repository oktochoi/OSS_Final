import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreatePost.module.css';

export default function CreatePostLib() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null); // 실제 File 객체
  const [preview, setPreview] = useState(null); // 미리보기 URL
  const [content, setContent] = useState('');
  const [isAnon, setIsAnon] = useState(false); // ✅ 익명 여부
  const [likes, setLikes] = useState(0); // ✅ 좋아요 수 직접 입력 가능
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const MOCK_API_URL = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram';

  /** 📸 이미지 파일 선택 시 미리보기 */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file); // 로컬 미리보기 URL 생성
      setPreview(previewUrl);
    }
  };

  /** 📨 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // MockAPI는 파일 업로드를 지원하지 않으므로 URL만 전송
      const imageUrl = preview || '';

      const newPost = {
        title,
        image: imageUrl,
        content,
        createdAt: new Date().toISOString(),
        likes: Number(likes) || 0, // ✅ 직접 입력한 좋아요 수
        isAnon: String(isAnon), // ✅ true/false → 문자열로
      };

      const response = await fetch(MOCK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('데이터 전송 실패');
      }

      alert('✅ 게시물이 성공적으로 등록되었습니다!');
      navigate('/mypage');
    } catch (error) {
      console.error('게시물 등록 오류:', error);
      alert('⚠ 게시물 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Hanstagram</h1>
      <h2>새 게시물 만들기</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 */}
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

        {/* 이미지 업로드 */}
        <div className={styles.formGroup}>
          <label htmlFor="image">이미지 업로드</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className={styles.inputFile}
          />
        </div>

        {/* 이미지 미리보기 */}
        {preview && (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="미리보기" className={styles.previewImage} />
          </div>
        )}

        {/* 내용 */}
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="캡션을 입력하세요..."
            required
            rows="8"
            className={styles.textarea}
          />
        </div>

        {/* ✅ 익명 여부 */}
        <div className={styles.formGroupCheckbox}>
          <label >
              익명으로 게시하기
            <input
              type="checkbox"
              checked={isAnon}
              onChange={() => setIsAnon(!isAnon)}
            />
          </label>
        </div>

        {/* ✅ 좋아요 초기값 입력 */}
        <div className={styles.formGroup}>
          <label htmlFor="likes">좋아요 수 (초기값)</label>
          <input
            id="likes"
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* 게시 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '게시 중...' : '게시하기'}
        </button>
      </form>
    </div>
  );
}
