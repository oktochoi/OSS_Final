import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  const [showTextarea, setShowTextarea] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <h1 className={`${styles.log1} ${styles.desktopOnly}`}>ℌ𝔞𝔫𝔰𝔱𝔞𝔯𝔤𝔯𝔞𝔪</h1>

      <ul className={styles.menu}>
        <li>
          <img src="home.png" alt="홈" className={`${styles.icon} ${styles.mobileOnly}`} />
          <span>홈</span>
        </li>
        <li>
          <img 
            src="search.png" 
            alt="검색" 
            className={`${styles.icon} ${styles.mobileOnly}`} 
            onClick={() => setShowTextarea(!showTextarea)} 
          />
          {showTextarea ? (
            <textarea
              className={styles.searchTextarea}
              placeholder="검색"
              rows="1"
            />
          ) : (
            <span>검색</span>
          )}
        </li>
        <li>
          <img
            src="Navigation Icons.png"
            alt="릴스"
            className={`${styles.icon} ${styles.mobileOnly}`}
          />
          <span>릴스</span>
        </li>
        <li className={styles.nomobileOnly}>
          <img src="Union.png" alt="메시지" className={styles.icon} />
          <span>메시지</span>
        </li>
        <li>
          <img src="Yes.png" alt="알림" className={`${styles.icon} ${styles.mobileOnly}`} />
          <span>알림</span>
        </li>
        <li className={styles.nomobileOnly}>
          <Link to= "/create" className={styles.link}> 
          <img src="as.png" alt="만들기" className={styles.icon} />
          <span>만들기</span>
          </Link>
        </li>
        <li>
          <Link to="/thread" className={styles.link}>
            <img src="thread.webp" alt="쓰레드" className={`${styles.icon} ${styles.mobileOnly}`} />
            <span>쓰레드</span>
          </Link>
        </li>
        <li>
          <Link to="/mypage" className={styles.link}>
            <img src="Icons.png" alt="프로필" className={`${styles.icon} ${styles.mobileOnly}`} />
            <span>프로필</span>
          </Link>
        </li>
      </ul>

      <div className={styles.more}>
        <img
          src="=.png"
          alt="더 보기"
          className={`${styles.moreicon} ${styles.nomobileOnly}`}
        />
        <span>더 보기</span>
      </div>
    </aside>
  );
}
