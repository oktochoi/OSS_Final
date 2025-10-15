import { useState, useEffect } from 'react'; // useEffect 추가
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';

export default function MyPage() { // 컴포넌트 이름 변경 (HomePage -> MyPage)
  const { name, profileImage } = useUserStore();
  
  const [posts, setPosts] = useState([]); // 게시물 목록 전체를 저장
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 게시물의 ID를 저장
  const [likedPosts, setLikedPosts] = useState({});

  // API에서 게시물 목록을 불러오기 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setPosts(data.reverse()); // 최신순으로 정렬
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []); // 처음 한 번만 실행


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
        <section className={styles.profileSection}>
          <img src={profileImage} className={styles.avatar} alt="프로필" />
          <div className={styles.profileInfo}>
            <h2>
              <span className={styles.name}>{name || '닉네임없음'}</span>
              <Link to="/info"><button>프로필 편집</button></Link>
            </h2>
            {/* 게시물 숫자를 동적으로 표시 */}
            <span className={styles.profileStat}>게시물 {posts.length}</span>
            <span className={styles.profileStat}>팔로워 0 </span>
            <span className={styles.profileStat}>팔로우 0 </span>
          </div>
        </section>

        <hr className={styles.divider} />

        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {/* 3. API에서 받아온 posts 배열을 기반으로 그리드를 생성 */}
            {posts.map((post) => (
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
      </main>

      {/* 4. ImageModal에 selectedPostId를 postId라는 이름으로 전달 */}
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