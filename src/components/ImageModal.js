'use client';

import { useState } from 'react';
import styles from '../styles/ImageModal.module.css';

export default function ImageModal({ src, onClose, liked, onLikeToggle }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 이미지 섹션 */}
        <div className={styles.imageSection}>
          <img src={src} alt="게시물" />
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentSection}>
          <div className={styles.userInfo}>
            <img src="/Avatar.svg" className={styles.commentAvatar} alt="유저" />
            <span>oktorot0</span>
            <img src="/other.svg" className={styles.other} alt="옵션" />
          </div>

          <div className={styles.comments}>
            {comments.map((c, i) => (
              <div key={i} className={styles.commentItem}>
                <img src={c.profileImage} className={styles.commentAvatar} alt="유저" />
                <span className={styles.name}>{c.username}</span>
                <p className={styles.content}>{c.content}</p>
              </div>
            ))}
          </div>

          {/* 아이콘 영역 */}
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

          {/* 댓글 입력 영역 */}
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
