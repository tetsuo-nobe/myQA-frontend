"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuestions, postQuestion, Question } from "@/lib/api";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 質問投稿フォームの状態
  const [questionText, setQuestionText] = useState("");
  const [questionerName, setQuestionerName] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /** 質問一覧を取得する */
  const fetchQuestions = () => {
    getQuestions()
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  /** 質問を投稿する */
  const handleSubmit = async () => {
    if (!questionText.trim() || !questionerName.trim()) {
      setError("質問内容と質問者名を入力してください。");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await postQuestion(questionText, questionerName, category);
      setQuestionText("");
      setQuestionerName("");
      setCategory("");
      fetchQuestions();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <>
      <h1>Q&amp;A</h1>

      {/* 質問投稿フォーム */}
      <div className="form-group">
        <label htmlFor="question-text">質問内容</label>
        <textarea
          id="question-text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="質問を入力してください"
        />
      </div>
      <div className="form-group">
        <label htmlFor="questioner-name">質問者名</label>
        <input
          id="questioner-name"
          type="text"
          value={questionerName}
          onChange={(e) => setQuestionerName(e.target.value)}
          placeholder="質問者名を入力してください"
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">カテゴリ</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">選択してください</option>
          <option value="技術関連">技術関連</option>
          <option value="一般">一般</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "送信中..." : "質問投稿"}
        </button>
      </div>

      {/* 質問一覧 */}
      <h2 style={{ marginBottom: "12px" }}>質問一覧</h2>
      {questions.length === 0 ? (
        <p>質問はまだありません。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>質問</th>
              <th>質問者</th>
              <th>カテゴリ</th>
              <th>質問日時</th>
              <th>回答数</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.question_id}>
                <td>
                  <Link href={`/questions/${q.question_id}`}>
                    {q.question_text}
                  </Link>
                </td>
                <td>{q.questioner_name}</td>
                <td>{q.category}</td>
                <td>{q.question_datetime}</td>
                <td>{q.answer_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
