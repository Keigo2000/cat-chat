import { NextResponse } from 'next/server';
import { AzureOpenAI } from "openai";

// POSTリクエストを処理するAPI関数
export async function POST(req: Request) {
  try {
    // クライアントから送信されたメッセージを取得
    const { messages } = await req.json();

    // AIの性格を定義するシステムメッセージ
    const systemMessage = {
        role: 'system',
        content: 'あなたは猫のAIです。名前は「ミケ」です。語尾に「にゃ」をつけて話してください。親しみやすく、かわいらしい口調で話してください。お魚の話題になると特に嬉しそうにします。あなたは猫のように振る舞い、質問には猫らしい視点で答えます。'
    };
    
    // システムメッセージとユーザーメッセージを結合
    const completeMessages = [systemMessage, ...messages];
    
    // これらの環境変数を設定するか、次の値を編集する必要があります
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;  
    const apiKey = process.env.AZURE_OPENAI_API_KEY; 
    const apiVersion = "2024-05-01-preview";  
    const deployment = "gpt-4o"; // これはデプロイ名と一致している必要があります
    
    // Azure OpenAIクライアントを初期化
    const client = new AzureOpenAI({ endpoint, apiKey,  apiVersion, deployment });  

    // Azure OpenAI APIを呼び出して応答を取得
    const result = await client.chat.completions.create({  
        model: deployment,  
        messages: completeMessages,  
        max_tokens: 800,  
        temperature: 0.7,  
        top_p: 0.95,  
        frequency_penalty: 0,  
        presence_penalty: 0,  
        stop: null  
      });  
      
    // 応答をJSON形式で返す
      return NextResponse.json({
        choices: [{
            message: {
                content: result.choices[0].message.content
            }
        }]
     });
  } catch {
    // エラー発生時のエラーレスポンス
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}