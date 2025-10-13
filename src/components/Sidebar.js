import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      {/* 데스크탑 전용 텍스트 로고 */}
      <div className={`${styles.logo} ${styles.desktopOnly}`}>
        <img
          src="/Vector.png"
          alt="Instagram 로고"
          className={styles.logoImage}
        />
      </div>

      {/* 모바일/태블릿용 아이콘 로고 */}
      <div className={`${styles.logo} ${styles.mobileOnly}`}>
        <img
          src="/logo2.png"
          alt="Instagram 아이콘 로고"
          className={styles.logoImage}
        />
      </div>

      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <img src="/Home.png" alt="홈" />
          <span>홈</span>
        </li>
        <li className={styles.menuItem}>
          <img src="/Navigation Icons.png" alt="검색" />
          <span>검색</span>
        </li>
        <li className={styles.menuItem}>
          <img src="/lelay.png" alt="릴스" />
          <span>릴스</span>
        </li>
        <li className={styles.menuItem}>
          <img src="/Heart.png" alt="알림" />
          <span>알림</span>
        </li>
        <li>
          <Link to="/mypage" className={styles.menuItem}>
            <img src="/Avatar.png" alt="프로필" />
            <span>프로필</span>
          </Link>
        </li>

        {/* 모바일에선 안 보임 */}
        <li className={`${styles.menuItem} ${styles.hideOnMobile}`}>
          <img src="/Union.png" alt="메시지" />
          <span>메시지</span>
        </li>
        <li className={`${styles.menuItem} ${styles.hideOnMobile}`}>
          <img src="/create.png" alt="만들기" />
          <span>만들기</span>
        </li>
      </ul>

      {/* 더 보기 버튼도 모바일에선 숨김 */}
      <div className={`${styles.menuItem} ${styles.more} ${styles.hideOnMobile}`}>
        <img src="/3line.png" alt="더 보기" />
        <span>더 보기</span>
      </div>
    </div>
  );
}
