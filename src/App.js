// App.js
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/registerpage'
import MyPage from './pages/mypage'
import InfoEditPage from './pages/info';  
import CreatePost from './lib/create'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/info" element={<InfoEditPage />} />
      <Route path="/create" element={ <CreatePost /> } /> 
    </Routes>
  )
}
