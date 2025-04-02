// app/navtest/page.tsx
import BottomNav from '@/components/BottomNav'; // パスは調整してね

export default function NavTestPage() {
  return (
    <main style={{ paddingBottom: '56px' }}>
      {/* 中身は空でOK */}
      <h2>ナビゲーションバー表示テスト</h2>

      {/* BottomNavを表示 */}
      <BottomNav />
    </main>
  );
}