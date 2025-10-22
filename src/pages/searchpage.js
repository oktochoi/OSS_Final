import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import ImageModal from '../components/ImageModal';
import styles from '../styles/Mypage.module.css'; // 일단 Mypage 스타일 재사용

const POST_API = 'https://68db332b23ebc87faa323c66.mockapi.io/Hanstagram';

export default function SearchPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!query) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(POST_API);
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        const lowerCaseQuery = query.toLowerCase();
        
        const filteredPosts = data.filter(post => 
          post.title && post.title.toLowerCase().includes(lowerCaseQuery)
        );

        setPosts(filteredPosts.reverse());
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [query]); // query가 변경될 때마다 이 effect가 다시 실행됨

  // 삭제 성공 시 목록에서 해당 포스트 제거
  const removePostFromState = (deletedPostId) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId));
  };

  return (
    <div className={styles.pageWrapper}>
      <Sidebar />
      <main className={styles.main}>
        <h2 className={styles.profileInfo}>
          검색 결과: "{query}"
        </h2>

        <hr className={styles.divider} />

        {isLoading ? (
          <div>로딩 중입니다...</div>
        ) : posts.length === 0 ? (
          <p>"{query}"에 대한 검색 결과가 없습니다.</p>
        ) : ( 
          <section className={styles.gridSection}>
            <div className={styles.grid}>
              {posts.map((post) => (
                <div key={post.id} className={styles.post} onClick={() => setSelectedPost(post)}>
                  <img src={post.image} alt={post.title} />
                  <div className={styles.overlay}>
                    <span className={styles.lc}>
                      <img src={'/love.svg'} alt="좋아요" /> 좋아요
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
      </main>

      {selectedPost && (
        <ImageModal
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
          onDeleteSuccess={removePostFromState}
        />
      )}
    </div>
  );
}