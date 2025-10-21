import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import styles from '../styles/thread.module.css';
import { useUserStore } from '../store/userStore';

// MockAPI URL
const MOCK_API_URL = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

export default function CreatePost() {
  const navigate = useNavigate();
  const username = useUserStore((state) => state.name);

  // 🪄 react-hook-form 기본 설정
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      isAnon: false,
    },
  });

  /** 📨 게시물 전송 함수 */
  const onSubmit = async (data) => {
    const newPost = {
      title: data.title,
      content: data.content,
      isAnon: String(data.isAnon),
      author: data.isAnon ? '익명' : username || '작성자없음',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
    };

    try {
      const res = await axios.post(MOCK_API_URL, newPost);
      console.log('서버 응답:', res.data);
      alert('✅ 게시물이 성공적으로 등록되었습니다!');
      reset(); // 입력값 초기화
      navigate('/mypage');
    } catch (error) {
      console.error('게시물 등록 중 오류:', error);
      alert('⚠ 게시물 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Hanstagram</h1>
      <h2>글 남기기</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* 제목 입력 */}
        <div className={styles.formGroup}>
          <label>
            <span className="badge text-bg-secondary">제목</span>
          </label>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            className={styles.input}
            {...register('title', { required: '제목은 필수입니다.' })}
          />
          {errors.title && <p className="text-danger small">{errors.title.message}</p>}
        </div>

        {/* 내용 입력 */}
        <div className={styles.formGroup}>
          <label>
            <span className="badge text-bg-secondary">내용</span>
          </label>
          <textarea
            rows="10"
            placeholder="내용을 입력하세요"
            className={styles.textarea}
            {...register('content', { required: '내용은 필수입니다.' })}
          />
          {errors.content && <p className="text-danger small">{errors.content.message}</p>}
        </div>

        {/* 익명 옵션 */}
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              {...register('isAnon')}
            />
            <span className="badge text-bg-secondary ms-2">
              익명으로 게시하기
            </span>
          </label>
        </div>

        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? '게시 중...' : '게시하기'}
        </button>
      </form>
    </div>
  );
}
