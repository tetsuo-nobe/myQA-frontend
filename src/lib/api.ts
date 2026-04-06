/**
 * バックエンド API との通信を行うモジュール
 */

// API Gateway のエンドポイント URL
// 環境変数 NEXT_PUBLIC_API_URL で設定する
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/** 質問一覧の型定義 */
export type Question = {
  question_id: string;
  question_text: string;
  questioner_name: string;
  question_datetime: string;
  category: string;
  answer_count: number;
};

/** 回答の型定義 */
export type Answer = {
  kind: string;
  answer_text: string;
  answerer_name: string;
  answer_datetime: string;
};

/** 質問詳細レスポンスの型定義 */
export type QuestionDetail = {
  question: Question;
  answers: Answer[];
};

/** 質問一覧を取得する */
export async function getQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE_URL}/questions`);
  if (!res.ok) {
    throw new Error("質問一覧の取得に失敗しました");
  }
  return res.json();
}

/** 質問詳細と回答一覧を取得する */
export async function getQuestion(questionId: string): Promise<QuestionDetail> {
  const res = await fetch(`${API_BASE_URL}/questions/${questionId}`);
  if (!res.ok) {
    throw new Error("質問詳細の取得に失敗しました");
  }
  return res.json();
}

/** 回答を投稿する */
export async function postAnswer(
  questionId: string,
  answerText: string,
  answererName: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answer_text: answerText,
      answerer_name: answererName,
    }),
  });
  if (!res.ok) {
    throw new Error("回答の投稿に失敗しました");
  }
}

/** 質問を投稿する */
export async function postQuestion(
  questionText: string,
  questionerName: string,
  category: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question_text: questionText,
      questioner_name: questionerName,
      category: category,
    }),
  });
  if (!res.ok) {
    throw new Error("質問の投稿に失敗しました");
  }
}
