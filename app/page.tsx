'use client';
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // メッセージ履歴、入力値、ローディング状態を管理するステート
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // メッセージ送信時の処理
  const handleSubmit = async () => {
    // 空文字列の場合は処理を中断
    if (!input.trim()) return;

    // ローディング状態を開始
    setIsLoading(true);
    // 新しいメッセージ配列を作成（既存のメッセージ + ユーザーの新規メッセージ）
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    // 入力フィールドをクリア
    setInput('');

    try {
      // APIにメッセージを送信
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      // レスポンスを受け取り、メッセージ履歴に追加
      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // 処理完了後、ローディング状態を解除
      setIsLoading(false);
    }
  };

  return (
    // チャットUIのメインコンテナ
    <div className="max-w-4xl mx-auto p-6">
      {/* タイトル */}
      <h1 className="text-6xl font-bold mb-4 text-center">ミケちゃんChat</h1>
      
      {/* 入力エリア */}
      <div className="space-y-4">
        {/* メッセージ入力フィールド */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ここにメッセージを入力してね♪"
          rows={5}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {/* 送信ボタン - ローディング中は無効化 */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '回答生成中...' : '送信'}
        </button>
      </div>

      {/* チャット履歴表示エリア */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">チャット履歴</h2>
        {/* スクロール可能なメッセージリストコンテナ */}
        <div
          className="border rounded-lg p-4 max-h-[600px] overflow-y-auto"
        >
          {/* メッセージの繰り返し表示 */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
              {/* メッセージの送信者表示 */}
              <div className="font-bold mb-1">
                {message.role === 'user' ? 'あなた' : 'ミケちゃん'}:
              </div>
              {/* メッセージの内容表示 - 改行を維持 */}
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}