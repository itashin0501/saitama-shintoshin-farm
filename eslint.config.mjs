import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  settings: {
    react: {
      version: "19.2.8"
    }
  },
  rules: {
    // eslint-config-next 16でデフォルト有効化された新ルール。
    // 既存のマウント時fetchパターン(useEffect内でのデータ取得)を広範囲に
    // 検知するため、当面はwarningに留める。個別の見直しは別タスクで対応。
    "react-hooks/set-state-in-effect": "warn"
  },
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
