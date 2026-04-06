# myQA-frontend
課題: Q&amp;A アプリケーションのフロントエンド

* next.config.ts に allowDevOrigins でホスト名を指定する
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['ec2-54-178-101-99.ap-northeast-1.compute.amazonaws.com'],
};

export default nextConfig;
```
