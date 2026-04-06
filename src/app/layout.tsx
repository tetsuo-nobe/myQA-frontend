import "./globals.css";

export const metadata = {
  title: "myQA",
  description: "Q&A アプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
