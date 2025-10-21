import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css';
import { useUserStore } from '../store/userStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const POST_API = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram';
const THREAD_API = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

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

  const [viewMode, setViewMode] = useState('post'); // post or thread
  const [posts, setPosts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [verse, setVerse] = useState(null);
  const [postSortOrder, setPostSortOrder] = useState('newest');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 게시물의 ID를 저장
  const [likedPosts, setLikedPosts] = useState({});
  

  // ❤️ 좋아요 토글
  const toggleLike = (src) => {
    setLikedImages((prev) => ({
      ...prev,
      [src]: !prev[src],
    }));
  };

  // 📖 랜덤 성경구절
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setVerse(verses[randomIndex]);
  }, []);

  // 🧵 Thread GET
  const fetchThreads = async () => {
    try {
      const res = await axios.get(THREAD_API);
      setThreads(res.data);
    } catch (err) {
      console.error('Thread 불러오기 오류:', err);
    }
  };

  // 🖼 게시물 GET
  const fetchPosts = async () => {
      try {
        const response = await fetch(POST_API);
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    // post 객체에 createdAt이 있다고 가정합니다.
    const dateA = new Date(a.createdAt); 
    const dateB = new Date(b.createdAt);
    
    if (postSortOrder === 'newest') {
      return dateB - dateA; // 최신순
    } else {
      return dateA - dateB; // 오래된순
    }
  });

  useEffect(() => {
    if (viewMode === 'post') {
        fetchPosts();
      } else {
        fetchThreads();
      }
  }, [viewMode]);

  const recentThreads = threads.slice(-6).reverse();

  // 삭제 성공 시 목록에서 해당 포스트 제거
  const removePostFromState = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };
  
  if (isLoading) {
    return <div>로딩 중입니다...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <main className={styles.main}>
        {/* 프로필 섹션 */}
        <section className={styles.profileSection}>
          <img src={profileImage} className={styles.avatar} alt="프로필" />
          <div className={styles.profileInfo}>
            <h2>
              <span className={styles.name}>{name || '닉네임없음'}</span>
              <Link to="/info">
                <button>프로필 편집</button>
              </Link>
            </h2>
            <span className={styles.profileStat}>게시물 {posts.length}</span>
            <span className={styles.profileStat}>팔로워 0 </span>
            <span className={styles.profileStat}>팔로우 0 </span><br />
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

        {/* 🪄 뷰 선택 버튼 */}
        <div className={styles.viewButtons}>
          <button
            onClick={() => setViewMode('post')}
            className={viewMode === 'post' ? styles.activeBtn : ''}
          >
            🖼 게시물 보기
          </button>
          <button
            onClick={() => setViewMode('thread')}
            className={viewMode === 'thread' ? styles.activeBtn : ''}
          >
            🧵 Thread 보기
          </button>
        </div>
        

        {/* 정렬 선택 드롭다운 */}
        {viewMode === 'post' && (
          <div className= {styles.sortContainer}>
            <select 
              onChange={(e) => setPostSortOrder(e.target.value)} 
              value={postSortOrder}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #dbdbdb' }}
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        )}

        {/* 📸 최근 6개 게시물 */}
        
        {viewMode === 'post' && (
          <section className={styles.gridSection}>
            <div className={styles.grid}>
              {sortedPosts.map((post) => (
                <div key={post.id} className={styles.post} onClick={() => setSelectedPostId(post.id)}>
                  <img src={post.image} alt={post.title} />
                  <div className={styles.overlay}>
                    <span className={styles.lc}>
                      <img src={likedPosts[post.id] ? 'reallove.svg' : 'love.svg'} alt="좋아요" /> 좋아요
                    </span>
                    <span className={styles.lc}>
                      <img src="comments.svg" alt="댓글" /> 댓글
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🧵 최근 6개 Thread */}
        {viewMode === 'thread' && (
          <section className={styles.threadSection}>
            {recentThreads.length === 0 ? (
              <p className={styles.noThread}>Thread가 없습니다.</p>
            ) : (
              recentThreads.map((t) => {
                const initials =
                  t.isAnon === 'true' || t.isAnon === true
                    ? '익명'
                    : (t.author?.[0] ?? 'U');

                return (
                  <article key={t.id} className={styles.threadCard}>
                    <div className={styles.threadHeader}>
                      <div className={styles.threadAvatar}>{initials}</div>
                      <div className={styles.threadMeta}>
                        <span className={styles.threadAuthor}>{t.author}</span>
                        <time className={styles.threadTime}>
                          {new Date(t.createdAt).toLocaleString()}
                        </time>
                      </div>
                      <button className={styles.threadMoreBtn}>⋯</button>
                    </div>

                    {t.title && <h3 className={styles.threadTitle}>{t.title}</h3>}
                    <div className={styles.threadContent}>{t.content}</div>

                    <div className={styles.threadBadges}>
                      {t.isAnon === 'true' || t.isAnon === true ? (
                        <span className={`${styles.badge} ${styles.badgeAnon}`}>익명</span>
                      ) : (
                        <span className={styles.badge}>작성자</span>
                      )}
                    </div>

                    <div className={styles.threadActions}>
                      <button className={styles.actionBtn}>
                        <img src="love.svg" alt="" width="16" /> 좋아요 {t.likes ?? 0}
                      </button>
                      <button className={styles.actionBtn}>
                        <img src="comments.svg" alt="" width="16" /> 댓글
                      </button>
                      <div className={styles.actionsSpacer} />
                      <button className={styles.actionBtn}>↗ 공유</button>
                    </div>
                  </article>
                );
              })
            )}
            {threads.length > 6 && (
              <div className={styles.moreBtnWrapper}>
                <button onClick={() => navigate('/allthread')} className={styles.moreBtn}>
                  🧵 전체 Thread 보기
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* 이미지 클릭 시 모달 */}
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          onClose={() => setSelectedImage(null)}
          liked={likedImages[selectedImage] || false}
          onLikeToggle={() => toggleLike(selectedImage)}
        />
      )}

      {selectedPostId && (
        <ImageModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
          onDeleteSuccess={removePostFromState} 
          // 좋아요 기능은 모달 안에서 자체적으로 처리하거나, 또는 postId 기반으로 전달할 수 있습니다.
          // 우선 모달이 자체적으로 데이터를 불러오므로 이 부분은 단순화합니다.
        />
      )}
    </div>
  );
}
