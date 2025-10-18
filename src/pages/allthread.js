import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
import Sidebar from '../components/Sidebar';
import styles from '../styles/AllThreadPage.module.css';
import { useNavigate } from 'react-router-dom';

const THREAD_API = 'https://68ec478eeff9ad3b1401a745.mockapi.io/post';

export default function AllThread() {
  const { name, profileImage } = useUserStore();
  const [threads, setThreads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all | anon | named
  const [sortType, setSortType] = useState('newest'); // newest | oldest
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧵 전체 Thread 가져오기
  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(THREAD_API);
      setThreads(res.data.reverse()); // 최신순 기본
    } catch (err) {
      console.error('Thread 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  // 🔍 검색 및 필터 로직
  const filteredThreads = threads
    .filter((t) => {
      const isAnon = t.isAnon === 'true' || t.isAnon === true;
      const matchesSearch =
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === 'all'
          ? true
          : filterType === 'anon'
          ? isAnon
          : !isAnon;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortType === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <h2>전체 Thread</h2>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← 돌아가기
          </button>
        </header>

        {/* 🔍 검색창 & 필터 */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="제목 또는 내용을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <div className={styles.filterGroup}>
            <button
              className={`${styles.toggleBtn} ${filterType === 'all' ? styles.active : ''}`}
              onClick={() => setFilterType('all')}
            >
              전체
            </button>
            <button
              className={`${styles.toggleBtn} ${filterType === 'anon' ? styles.active : ''}`}
              onClick={() => setFilterType('anon')}
            >
              익명만
            </button>
            <button
              className={`${styles.toggleBtn} ${filterType === 'named' ? styles.active : ''}`}
              onClick={() => setFilterType('named')}
            >
              이름만
            </button>
          </div>

          <div className={styles.filterGroup}>
            <button
              className={`${styles.toggleBtn} ${sortType === 'newest' ? styles.active : ''}`}
              onClick={() => setSortType('newest')}
            >
              최신순
            </button>
            <button
              className={`${styles.toggleBtn} ${sortType === 'oldest' ? styles.active : ''}`}
              onClick={() => setSortType('oldest')}
            >
              오래된순
            </button>
          </div>

        </div>

        {/* Thread 목록 */}
        {loading ? (
          <p className={styles.loading}>불러오는 중...</p>
        ) : filteredThreads.length === 0 ? (
          <p className={styles.noResult}>검색 결과가 없습니다.</p>
        ) : (
          <section className={styles.threadList}>
            {filteredThreads.map((t) => {
              const isAnon = t.isAnon === 'true' || t.isAnon === true;
              return (
                <article key={t.id} className={styles.threadCard}>
                  <div className={styles.headerRow}>
                    <div className={styles.avatarWrapper}>
                      {isAnon ? (
                        <span className={styles.anonTag}>익명</span>
                      ) : (
                        <img
                          src={profileImage}
                          alt="profile"
                          className={styles.avatar}
                        />
                      )}
                    </div>
                    <div>
                      <span className={styles.author}>
                        {isAnon ? '익명' : t.author || name}
                      </span>
                      <time className={styles.time}>
                        {new Date(t.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>

                  {t.title && (
                    <h3 className={styles.title}>{t.title}</h3>
                  )}
                  <p className={styles.content}>{t.content}</p>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
