'use client';

import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ImageModal.module.css';

// props로 postId, onClose, onDeleteSuccess를 받습니다.
export default function ImageModal({ postId, onClose, onDeleteSuccess }) {
  // 2. 데이터 fetching을 위한 상태 추가
  const [post, setPost] = useState(null); // API에서 받아온 게시물 상세 정보
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // 댓글 관련 상태는 그대로 유지
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // postId가 바뀔 때마다 API에서 상세 데이터를 가져오는 useEffect
  useEffect(() => {
    // postId가 없으면 아무 작업도 하지 않음
    if (!postId) return;

    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram/${postId}`);
        if (!response.ok) {
          throw new Error('게시물 정보를 불러올 수 없습니다.');
        }
        const data = await response.json();
        setPost(data); // 받아온 데이터로 post 상태 업데이트
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]); // postId가 변경될 때마다 이 효과를 다시 실행

  // 삭제 핸들러 
  const handleDelete = async () => {
    if (!post) return;
    const confirmDelete = window.confirm('정말로 이 게시물을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram/${post.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('삭제에 실패했습니다.');
        alert('게시물이 삭제되었습니다.');
        onDeleteSuccess(post.id);
        onClose();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  //수정 핸들러 
  const handleEdit = () => {
    if (!post) return;
    navigate(`/edit/${post.id}`);
  };

  // 댓글 게시 핸들러
  const handlePost = () => {
    if (newComment.trim() === '') return;
    const newItem = {
      profileImage: '/Avatar.svg',
      username: 'oktorot0',
      content: newComment,
    };
    setComments([...comments, newItem]);
    setNewComment('');
  };

  const handleLikeToggle = () => {
    setIsLiked(currentValue => !currentValue);
  };

  // 로딩 및 에러 상태에 따른 UI 렌더링
  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.status}>로딩 중...</div>;
    }
    if (error) {
      return <div className={styles.status}>오류: {error}</div>;
    }
    if (!post) {
      return <div className={styles.status}>게시물 정보가 없습니다.</div>;
    }

    // 데이터 로딩 성공 시 실제 모달 컨텐츠 렌더링
    return (
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageSection}>
          <img src={post.image} alt={post.title} />
        </div>
        
        <div className={styles.commentSection}>
          <div className={styles.userInfo}>
            <img 
              src={post.isAnon ? '/Avatar.svg' : (post.avatar || '/Avatar.svg')} 
              className={styles.commentAvatar} 
              alt="유저" 
            />
            <span>{post.isAnon ? '익명' : (post.author || '작성자')}</span>
            <img src="/Other.svg" className={styles.other} alt="옵션" onClick={() => setShowDropdown(!showDropdown)} />
            {showDropdown && (
              <div className={styles.dropdown}>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
              </div>
            )}
          </div>
          
          <div className={styles.comments}>
            <div className={styles.postContent}>
              <p>{post.content}</p>
            </div>
            {comments.map((c, i) => (
              <div key={i} className={styles.commentItem}>
                <img src={c.profileImage} className={styles.commentAvatar} alt="유저" />
                <span className={styles.name}>{c.username}</span>
                <p className={styles.content}>{c.content}</p>
              </div>
            ))}
          </div>

          <div className={styles.iconBar}>
            <img
              src={isLiked ? '/reallove.svg' : '/Love.png'}
              className={styles.commentbar}
              alt="좋아요"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
            />
            <img src="/comment.jpg" className={styles.commentbar} alt="댓글" />
            <img src="/share.jpg" className={styles.commentbar} alt="공유" />
            <img src="/Post.jpg" className={styles.commentpostbar} alt="저장" />
          </div>

          <div className={styles.commentInput}>
            <input
              type="text"
              placeholder="댓글 달기..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            />
            <button onClick={handlePost} className={styles.post}>
              게시
            </button>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {renderContent()}
    </div>
  );
}