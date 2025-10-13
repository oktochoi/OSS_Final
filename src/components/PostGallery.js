import styles from "../styles/Mypage.module.css";

export default function PostGallery({ likes, onClick }) {
  return (
    <div className={styles.gallery}>
      {likes.map((item, i) => (
        <div
          className={styles.postBox}
          key={i}
          onClick={() => onClick(`/${i + 1}.jpeg`, i)}
        >
          <img
            src={`/${i + 1}.jpeg`}
            alt={`post${i}`}
            className={styles.postImage}
          />
          <div className={styles.overlay}>
            <div className={styles.overlayContent}>
              <img
                src={item.liked ? "/clicked.png" : "/hover.png"}
                alt="like"
              />
              <span>{item.count}</span>
              <img src="/comment.png" alt="comment" />
              <span>댓글</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
