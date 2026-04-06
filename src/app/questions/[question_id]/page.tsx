"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuestion, postAnswer, Question, Answer } from "@/lib/api";

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.question_id as string;

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [answererName, setAnswererName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /** 質問詳細と回答一覧を取得する */
  const fetchData = () => {
    getQuestion(questionId)
      .then((data) => {
        setQuestion(data.question);
        setAnswers(data.answers);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [questionId]);

  /** 回答を投稿する */
  const handleSubmit = async () => {
    if (!answerText.trim() || !answererName.trim()) {
      setError("回答内容と回答者名を入力してください。");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await postAnswer(questionId, answerText, answererName);
      setAnswerText("");
      setAnswererName("");
      // 回答一覧を再取得する
      fetchData();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (!question) return <p className="error">質問が見つかりません。</p>;

  return (
    <>
      <h1>{question.question_text}</h1>
      <p>
        質問者: {question.questioner_name} ／ カテゴリ: {question.category} ／
        質問日時: {question.question_datetime}
      </p>

      <hr style={{ margin: "20px 0" }} />

      {/* 回答入力フォーム */}
      <div className="form-group">
        <label htmlFor="answer-text">回答</label>
        <textarea
          id="answer-text"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="回答を入力してください"
        />
      </div>
      <div className="form-group">
        <label htmlFor="answerer-name">回答者</label>
        <input
          id="answerer-name"
          type="text"
          value={answererName}
          onChange={(e) => setAnswererName(e.target.value)}
          placeholder="回答者名を入力してください"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="button-group">
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "送信中..." : "回答する"}
        </button>
        <button
          onClick={() => router.push("/")}
          style={{ backgroundColor: "#666" }}
        >
          Top に戻る
        </button>
      </div>

      {/* 回答一覧 */}
      <h2 style={{ marginTop: "16px", marginBottom: "12px" }}>
        回答一覧（{answers.length}件）
      </h2>
      {answers.length === 0 ? (
        <p>まだ回答はありません。</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>回答</th>
              <th>回答者</th>
              <th>回答日時</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a) => (
              <tr key={a.kind}>
                <td>{a.answer_text}</td>
                <td>{a.answerer_name}</td>
                <td>{a.answer_datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
