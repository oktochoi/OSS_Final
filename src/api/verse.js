export default async function handler(req, res) {
  const { path } = req.query;

  try {
    const response = await fetch(`https://ibibles.net/quote.php?${path}`);
    const html = await response.text();

    // ✅ <td>본문만 추출 (첫 번째는 구절, 두 번째는 내용)
    const match = html.match(/<td><b>(.*?)<\/b><\/td><\/tr>\s*<tr><td>(.*?)<\/td>/s);

    if (match) {
      const verseRef = match[1].trim();
      const verseText = match[2].trim();
      const combined = `<p><strong>${verseRef}</strong></p><p>${verseText}</p>`;

      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.status(200).send(combined);
    } else {
      res.status(404).send('<p>구절을 찾을 수 없습니다.</p>');
    }
  } catch (error) {
    console.error('성경 API 오류:', error);
    res.status(500).send('<p>성경 구절을 불러오지 못했습니다.</p>');
  }
}
