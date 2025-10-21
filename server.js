// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

// 프록시 라우트
app.get('/api/verse', async (req, res) => {
  const { path } = req.query;
  try {
    const response = await fetch(`https://ibibles.net/quote.php?${path}`);
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('프록시 오류:', error);
    res.status(500).send('성경 구절을 불러올 수 없습니다.');
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 프록시 서버 실행 중: http://localhost:${PORT}`);
});
