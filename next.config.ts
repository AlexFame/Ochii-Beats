// next.config.ts
import type { NextConfig } from "next";

// Генерируем ID версии билда (для авто-обновления в Телеге)
const BUILD_ID =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || String(Date.now());

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },

  async headers() {
    return [
      {
        // Запрещаем кэш для всех HTML/SSR (кроме статики _next и прочего)
        source: "/((?!_next/|favicon.ico|images/|fonts/).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
