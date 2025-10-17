'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ React Router 버전
import styles from '../styles/ImageModal.module.css';

export default function ImageModal({ post, onClose, liked, onLikeToggle }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const MOCK_API_URL = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram';

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

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) return;
    try {
      await fetch(`${MOCK_API_URL}/${post.id}`, { method: 'DELETE' });
      alert('🗑 게시물이 삭제되었습니다.');
      onClose();
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('⚠ 게시물 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    // ✅ React Router 방식으로 edit 페이지 이동
    navigate(`/lib/edit?id=${post.id}`);
  };

  if (!post) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 좌측: 이미지 */}
        <div className={styles.imageSection}>
          <img src={post.image} alt={post.title || '게시물'} />
        </div>

        {/* 우측: 내용 + 댓글 */}
        <div className={styles.commentSection}>
          <div className={styles.userInfo}>
            <img src="/Avatar.svg" className={styles.commentAvatar} alt="유저" />
            <span>{post.author || 'oktorot0'}</span>

            {/* 🔹 햄버거 바 */}
            <div className={styles.moreWrapper}>
              <button
                className={styles.moreBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                ⋯
              </button>

              {showMenu && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleEdit}>✏️ 수정</button>
                  <button onClick={handleDelete}>🗑 삭제</button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.postDetail}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postContent}>{post.content}</p>

            <div className={styles.postMeta}>
              <span>❤️ {post.likes}개</span>
              <span>🕓 {new Date(post.createdAt).toLocaleString()}</span>
              <span>🆔 {post.id}</span>
            </div>
          </div>

          <hr className={styles.divider} />

          <div className={styles.comments}>
            {comments.length === 0 ? (
              <p className={styles.noComment}>아직 댓글이 없습니다.</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className={styles.commentItem}>
                  <img src={c.profileImage} className={styles.commentAvatar} alt="유저" />
                  <span className={styles.name}>{c.username}</span>
                  <p className={styles.content}>{c.content}</p>
                </div>
              ))
            )}
          </div>

          <div className={styles.iconBar}>
            <img
              src={liked ? '/reallove.svg' : '/Love.png'}
              className={styles.commentbar}
              alt="좋아요"
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle();
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
    </div>
  );
}
