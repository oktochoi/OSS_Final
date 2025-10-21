import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css';
import { useUserStore } from '../store/userStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const POST_API = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram';
const THREAD_API = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

// ✅ 성경 구절 경로 목록
const verses = [
  { path: 'kor-gen/1:1-1:1', ref: '창세기 1:1' },
  { path: 'kor-jhn/3:16-3:16', ref: '요한복음 3:16' },
  { path: 'kor-rom/8:28-8:28', ref: '로마서 8:28' },
  { path: 'kor-psa/23:1-23:1', ref: '시편 23:1' },
  { path: 'kor-mat/5:9-5:9', ref: '마태복음 5:9' },
  { path: 'kor-phi/4:13-4:13', ref: '빌립보서 4:13' },
  { path: 'kor-jer/29:11-29:11', ref: '예레미야 29:11' },
  { path: 'kor-isa/41:10-41:10', ref: '이사야 41:10' }
];

export default function HomePage() {
  const { name, profileImage } = useUserStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const [verse, setVerse] = useState(null);
  const [verseContent, setVerseContent] = useState('');
  const [viewMode, setViewMode] = useState('post');
  const [posts, setPosts] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const navigate = useNavigate();

  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 게시물의 ID를 저장

  // ❤️ 좋아요 토글
  const toggleLike = (src) => {
    setLikedImages((prev) => ({
      ...prev,
      [src]: !prev[src],
    }));
  };

  // 📖 랜덤 성경 구절 불러오기
  useEffect(() => {
  const randomIndex = Math.floor(Math.random() * verses.length);
  const selected = verses[randomIndex];
  setVerse(selected);

  const proxy = 'https://corsproxy.io/?';
  fetch(`${proxy}https://ibibles.net/quote.php?${selected.path}`)
    .then((res) => res.text())
    .then((data) => setVerseContent(data))
    .catch((err) => {
      console.error('성경구절 불러오기 오류:', err);
      setVerseContent('<p>구절을 불러오지 못했습니다.</p>');
    });
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
        setPosts(data.reverse()); // 최신순으로 정렬
      } catch (error) {
        console.error(error);
        alert(error.message);
      } 
  };

  const removePostFromState = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  useEffect(() => {
    if (viewMode === 'post') fetchPosts();
    else fetchThreads();
  }, [viewMode]);

  // 외부 클릭 시 드롭다운 닫기 + ESC 닫기
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest?.(`.${styles.moreWrapper}`)) {
        setSelectedThread(null);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setSelectedThread(null);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // ✏️ Thread 수정
  const handleEdit = async (id, newTitle, newContent) => {
    try {
      const editedAt = new Date().toISOString();
      await axios.put(`${THREAD_API}/${id}`, {
        title: newTitle,
        content: newContent,
        editedAt,
      });
      setThreads((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, title: newTitle, content: newContent, editedAt }
            : t
        )
      );
      alert('✅ 수정이 완료되었습니다.');
    } catch (err) {
      console.error('Thread 수정 오류:', err);
      alert('⚠ Thread 수정 중 오류가 발생했습니다.');
    }
  };

  // 🗑 Thread 삭제
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${THREAD_API}/${id}`);
      setThreads((prev) => prev.filter((t) => t.id !== id));
      alert('🗑 Thread가 삭제되었습니다.');
    } catch (err) {
      console.error('Thread 삭제 오류:', err);
    }
  };

  const recentPosts = posts.slice(-6).reverse();
  const recentThreads = threads.slice(-6).reverse();
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
            <span className={styles.profileStat}>팔로워 0</span>
            <span className={styles.profileStat}>팔로우 0</span>

            {/* ✅ 오늘의 구절 */}
            <div className={styles.verseSection}>
              <h3>오늘의 구절 📖</h3>
              {verse && (
                <>
                  <p>{verse.ref}</p>
                  <div
                    className={styles.verseBox}
                    dangerouslySetInnerHTML={{ __html: verseContent }}
                  />
                </>
              )}
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 뷰 선택 */}
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

        {/* 게시물 or Thread 렌더링 */}
        {viewMode === 'post' ? (
          <section className={styles.gridSection}>
            <div className={styles.grid}>
              {recentPosts.length === 0 ? (
                <p>게시물이 없습니다.</p>
              ) : (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className={styles.post}
                    onClick={() => setSelectedImage(post)}
                  >
                    <img src={post.image} alt={post.title} />
                    <div className={styles.overlay}>
                      <span className={styles.lc}>
                        <img
                          src={likedImages[post.image] ? 'reallove.svg' : 'love.svg'}
                          alt="좋아요"
                        />{' '}
                        {post.likes}
                      </span>
                      <span className={styles.lc}>
                        <img src="comments.svg" alt="댓글" /> 댓글
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className={styles.threadSection}>
            {recentThreads.length === 0 ? (
              <p className={styles.noThread}>Thread가 없습니다.</p>
            ) : (
              recentThreads.map((t) => {
                const isAnon = t.isAnon === 'true' || t.isAnon === true;
                return (
                  <article key={t.id} className={styles.threadCard}>
                    <div className={styles.threadHeader}>
                      <div className={styles.threadAvatar}>
                        {isAnon ? (
                          <span>익명</span>
                        ) : (
                          <img src={profileImage} alt="avatar" className={styles.avatarImg} />
                        )}
                      </div>
                      <div className={styles.threadMeta}>
                        <span className={styles.threadAuthor}>
                          {isAnon ? '익명' : t.author || name}
                        </span>
                        <time className={styles.threadTime}>
                          {new Date(t.createdAt).toLocaleString()}
                          {t.editedAt && (
                            <span className={styles.editedTime}>
                              {' '}· 수정됨 {new Date(t.editedAt).toLocaleString()}
                            </span>
                          )}
                        </time>
                      </div>
                      <div className={styles.moreWrapper}>
                        <button
                          className={styles.threadMoreBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedThread(selectedThread === t.id ? null : t.id);
                          }}
                        >
                          ⋯
                        </button>
                        {selectedThread === t.id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              onClick={() => {
                                const newTitle = prompt('새 제목을 입력하세요:', t.title || '');
                                if (newTitle === null) return;
                                const newContent = prompt('새 내용을 입력하세요:', t.content || '');
                                if (newContent === null) return;
                                handleEdit(t.id, newTitle, newContent);
                                setSelectedThread(null);
                              }}
                            >
                              수정
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('정말 삭제하시겠습니까?')) {
                                  handleDelete(t.id);
                                  setSelectedThread(null);
                                }
                              }}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {t.title && <h3 className={styles.threadTitle}>{t.title}</h3>}
                    <div className={styles.threadContent}>{t.content}</div>
                    <div className={styles.threadBadges}>
                      {isAnon ? (
                        <span className={`${styles.badge} ${styles.badgeAnon}`}>익명</span>
                      ) : (
                        <span className={styles.badge}>{t.author || name}</span>
                      )}
                    </div>
                  </article>
                );
              })
            )}
            {threads.length > 0 && (
              <div className={styles.moreBtnWrapper}>
                <button onClick={() => navigate('/allthread')} className={styles.moreBtn}>
                  전체 Thread 보기
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* 이미지 클릭 시 모달 */}
      {selectedImage && (
        <ImageModal
          post={selectedImage}
          onClose={() => setSelectedImage(null)}
          liked={likedImages[selectedImage?.image] || false}
          onLikeToggle={() => toggleLike(selectedImage?.image)}
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
