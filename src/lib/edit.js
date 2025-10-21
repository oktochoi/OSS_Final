import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from '../styles/CreatePost.module.css'; // CreatePost의 스타일 그대로 재사용

export default function EditPost() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null); // 실제 파일 객체
  const [preview, setPreview] = useState(null); // 미리보기 URL
  const [content, setContent] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { postId } = useParams(); // /edit/:postId
  const navigate = useNavigate();

  const MOCK_API_URL = `https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram/${postId}`;
  console.log(image);

  /** 🔹 기존 게시물 데이터 불러오기 */
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(MOCK_API_URL);
        if (!res.ok) throw new Error('게시물 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setLikes(data.likes || 0);
        setIsAnon(data.isAnon === 'true' || data.isAnon === true);
        setPreview(data.image || null);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/mypage');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
  }, [MOCK_API_URL, navigate]);

  /** 🔹 이미지 변경 */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ 파일 크기는 최대 5MB까지 가능합니다.');
      return;
    }

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  /** 🔹 게시물 수정 */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const imageUrl = preview || '';

      const updatedPost = {
        title,
        image: imageUrl,
        content,
        likes: Number(likes),
        isAnon: String(isAnon),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(MOCK_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) throw new Error('게시물 수정 실패');

      alert('✅ 게시물이 성공적으로 수정되었습니다.');
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <h1>Hanstagram</h1>
      <h2>게시물 수정</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 */}
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            required
            rows="8"
            className={styles.textarea}
          />
        </div>

        {/* 익명 여부 */}
        <div className={styles.formGroupCheckbox}>
          <label>
            <input
              type="checkbox"
              checked={isAnon}
              onChange={() => setIsAnon(!isAnon)}
            />
            익명으로 게시하기
          </label>
        </div>

        {/* 좋아요 수 */}
        <div className={styles.formGroup}>
          <label htmlFor="likes">좋아요 수</label>
          <input
            id="likes"
            type="number"
            min="0"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '수정 중...' : '수정 완료'}
        </button>
      </form>
    </div>
  );
}

