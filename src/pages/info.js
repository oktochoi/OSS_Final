import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import Sidebar from '../components/Sidebar';
import styles from '../styles/Info.module.css';

export default function InfoEditPage() {
  const { name, profileImage, setName, setProfileImage } = useUserStore();
  const [newName, setNewName] = useState(name);
  const [newImage, setNewImage] = useState(profileImage);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    setName(newName);
    setProfileImage(newImage);
    alert('프로필이 수정되었습니다.');
    navigate('/mypage');
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>프로필 편집</h2>
        <p className={styles.description}>닉네임과 프로필 이미지를 수정하세요.</p>

        <div className={styles.profileEdit}>
          <img src={newImage} alt="프로필 미리보기" className={styles.profilePreview} />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          <br></br>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleSubmit} className={styles.button}>
          저장
        </button>
      </main>
    </div>
  );
}
