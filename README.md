# myQA-frontend
課題: Q&amp;A アプリケーションのフロントエンド

1. myQA-backend リポジトリの AWS SAM テンプレートをデプロイする
1. .env.production に API Gateway のエンドポイントを指定
    ```
    NEXT_PUBLIC_API_URL=https://h8pd7ednaa.execute-api.ap-northeast-1.amazonaws.com/prod
    ```

1. next.config.ts に allowDevOrigins でホスト名を指定する
    ```
    import type { NextConfig } from "next";
    
    const nextConfig: NextConfig = {
      /* config options here */
      allowedDevOrigins: ['ec2-54-178-101-99.ap-northeast-1.compute.amazonaws.com'],
    };
    
    export default nextConfig;
    ```
