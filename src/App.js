// App.js
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/registerpage'
import MyPage from './pages/mypage'
import InfoEditPage from './pages/info';  
import CreatePost from './pages/thread';
import CreatePostLib from './lib/create'
import EditPost from './lib/edit';
import AllThread from './pages/allthread';
import SearchPage from './pages/searchpage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/info" element={<InfoEditPage />} />
      <Route path="/thread" element={<CreatePost />} />
      <Route path="/create" element={ <CreatePostLib /> } /> 
      <Route path="/edit/:postId" element={<EditPost />} />
      <Route path="/allthread" element={<AllThread />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  )
}
