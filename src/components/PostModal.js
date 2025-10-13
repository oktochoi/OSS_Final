import { useState } from "react";
import styles from "../styles/Mypage.module.css";
import LikeButton from "./LikeButton";

export default function PostModal({ image, index, liked, count, onClose, onLike }) {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);

  const handleSubmit = () => {
    const cleanComment = comment.trim();
    if (!cleanComment) return;

    setCommentList((prev) => [...prev, cleanComment]);
    setComment(""); // ✨ 초기화는 반드시 마지막에!
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 왼쪽 - 이미지 */}
        <div className={styles.modalLeft}>
          <img src={image} alt={`post ${index + 1}`} />
        </div>

        {/* 오른쪽 - 댓글, 아이콘 */}
        <div className={styles.modalRight}>
          {/* 유저 정보 */}
          <div className={styles.modalHeader}>
            <img src="/Profile.jpeg" alt="프로필" className={styles.modalProfileImg} />
            <span className={styles.modalUsername}>h._.m1225</span>
          </div>
          <hr className={styles.divider} />

          {/* 댓글 목록 */}
          <div className={styles.modalComments}>
            {commentList.map((cmt, idx) => (
              <div className={styles.commentItem} key={`${cmt}-${idx}`}>
                <img src="/Profile.jpeg" alt="profile" className={styles.commentAvatar} />
                <p className={styles.commentText}>
                  <strong>h._.m1225</strong>&nbsp;{cmt}
                </p>
              </div>
            ))}
          </div>

          {/* 좋아요/댓글/저장 아이콘 */}
          <div className={styles.modalIconArea}>
            <hr className={styles.divider} />
            <div className={styles.modalInfo}>
              <LikeButton liked={liked} count={count} onClick={onLike} />
              <div className={styles.modalInfoItem}>
                <img src="/Yes.png" alt="댓글" />
              </div>
              <div className={styles.modalInfoItem}>
                <img src="/DM.png" alt="DM" />
              </div>
              <div className={`${styles.modalInfoItem} ${styles.saveIcon}`}>
                <img src="/Subtract.png" alt="저장" />
              </div>
            </div>
            <hr className={styles.divider} />
          </div>

          {/* 댓글 입력 */}
          <div className={styles.commentInputBox}>
            <input
              type="text"
              className={styles.commentInput}
              placeholder="댓글 달기..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button className={styles.commentPost} onClick={handleSubmit}>
              게시
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
