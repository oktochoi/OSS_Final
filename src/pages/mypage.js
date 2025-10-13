import { useState, useEffect } from 'react'; 
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';

const verses = [
  { url: "http://ibibles.net/quote.php?kor-gen/1:1-1:1", ref: "창세기 1:1" },
  { url: "http://ibibles.net/quote.php?kor-jhn/3:16-3:16", ref: "요한복음 3:16" },
  { url: "http://ibibles.net/quote.php?kor-rom/8:28-8:28", ref: "로마서 8:28" },
  { url: "http://ibibles.net/quote.php?kor-psa/23:1-23:1", ref: "시편 23:1" },
  { url: "http://ibibles.net/quote.php?kor-mat/5:9-5:9", ref: "마태복음 5:9" },
  { url: "http://ibibles.net/quote.php?kor-phi/4:13-4:13", ref: "빌립보서 4:13" },
  { url: "http://ibibles.net/quote.php?kor-jer/29:11-29:11", ref: "예레미야 29:11" },
  { url: "http://ibibles.net/quote.php?kor-isa/41:10-41:10", ref: "이사야 41:10" }
];



export default function HomePage() {
  const { name, profileImage } = useUserStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const [verse, setVerse] = useState(null);

  const toggleLike = (src) => {
    setLikedImages((prev) => ({
      ...prev,
      [src]: !prev[src],
    }));
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setVerse(verses[randomIndex]);
  }, []); // 새로고침 시 1회만 실행

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
            <br></br>
              <div>
                <h3>오늘의 구절 📖</h3>
                {verse && (
                  <>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{verse.ref}</p>
                    <iframe
                      src={verse.url}
                      width="600"
                      height="100"
                      style={{ border: 'none' }}
                      title="성경 구절"
                    ></iframe>
                  </>
                )}
              </div>
            </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {/* get한걸로 바꾸기 */}
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
