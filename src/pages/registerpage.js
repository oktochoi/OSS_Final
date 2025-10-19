// src/pages/RegisterPage.js
import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/registerpage.module.css' // CSS 경로는 위치에 맞게 조정
import { useUserStore } from '../store/userStore'
import { useState } from 'react'

export default function RegisterPage() {
  const { setName } = useUserStore()
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleRegister = () => {
    setName(username)
    navigate('/mypage')
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.logo}>ℍ𝕒𝕟𝕤𝕥𝕒𝕣𝕘𝕣𝕒𝕞</h1>
          <p className={styles.subtitle}>
            친구들의 사진과 동영상을 보려면 가입하세요.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="휴대폰 번호 또는 이메일 주소" className={styles.input} /><br />
            <input type="text" placeholder="성명" className={styles.input} /><br />
            <input
              type="text"
              placeholder="사용자 이름"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /><br />
            <input type="password" placeholder="비밀번호" className={styles.input} />

            <p className={styles.caption}>
              저희 서비스를 이용하는 사람이 회원님의 연락처 정보를<br />
              Instagram에 업로드했을 수도 있습니다.{' '}
              <span className={styles.wantLink}>더 알아보기</span>
            </p>

            <button
              type="button"
              className={styles.button}
              onClick={handleRegister}
            >
              가입
            </button>
          </form>
        </div>

        <div className={styles.loginBox}>
          <p className={styles.loginText}>
            계정이 있으신가요?{' '}
            <Link to="/mypage" className={styles.loginLink} onClick={handleRegister}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
