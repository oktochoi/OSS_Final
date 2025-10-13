import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { name, profileImage } = useUserStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});

  const toggleLike = (src) => {
    setLikedImages((prev) => ({
      ...prev,
      [src]: !prev[src],
    }));
  };

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <main className={styles.main}>
        <section className={styles.profileSection}>
          <img src={profileImage} className={styles.avatar} alt="프로필" />
          <div className={styles.profileInfo}>
            <h2>
              <span className={styles.name}>{name || '닉네임없음'}</span>
              <Link to="/info">
                <button>프로필 편집</button>
              </Link>
            </h2>
            <span className={styles.profileStat}>게시물 6 </span>
            <span className={styles.profileStat}>팔로워 0 </span>
            <span className={styles.profileStat}>팔로우 0 </span>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {['/11.jpg', '/22.jpg', '/33.jpg', '4.jpg', '5.jpg', '6.jpg'].map((src, idx) => (
              <div key={idx} className={styles.post} onClick={() => setSelectedImage(src)}>
                <img src={src} alt={`게시물 ${idx + 1}`} />
                <div className={styles.overlay}>
                  <span className={styles.lc}>
                    <img src={likedImages[src] ? 'reallove.svg' : 'love.svg'} alt="좋아요" /> 좋아요
                  </span>
                  <span className={styles.lc}>
                    <img src="comments.svg" alt="댓글" /> 댓글
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
          liked={likedImages[selectedImage] || false}
          onLikeToggle={() => toggleLike(selectedImage)}
        />
      )}
    </div>
  );
}
