import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Circle,
  FileCode2,
  GitBranch,
  MessageSquare,
  Search,
  Settings,
  Files,
  Bug,
  Blocks,
  Moon,
  Sun,
  ShieldCheck,
  Eye,
  Undo2,
  Zap,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { HarnessPanel } from "@/components/harness/panel";
import logo from "@/assets/iflow.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "心流·驭光 iFlow Harness — VSCode AI 编码代理面板" },
      {
        name: "description",
        content:
          "心流·驭光（iFlow Harness）把 iFlow CLI 搬进 VSCode 侧边栏：结构化消息流、工具审批、行级改动对比与一键回退。",
      },
      { property: "og:title", content: "心流·驭光 iFlow Harness — VSCode AI 编码代理面板" },
      {
        property: "og:description",
        content: "对话 → 观察 → 审批 → 审阅 → 回退，AI 改代码全过程可见、可控、可回退。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CODE: Array<Array<[string, string]>> = [
  [
    ["kw", "export function"],
    ["fn", " rateLimit"],
    ["p", "(key: string, windowMs = "],
    ["num", "60_000"],
    ["p", ") {"],
  ],
  [
    ["p", "  "],
    ["kw", "const"],
    ["p", " hits = windows."],
    ["fn", "get"],
    ["p", "(key) ?? []"],
  ],
  [
    ["p", "  "],
    ["kw", "const"],
    ["p", " now = Date."],
    ["fn", "now"],
    ["p", "()"],
  ],
  [
    ["p", "  "],
    ["kw", "const"],
    ["p", " live = hits."],
    ["fn", "filter"],
    ["p", "((t) => now - t < windowMs)"],
  ],
  [
    ["p", "  windows."],
    ["fn", "set"],
    ["p", "(key, live)"],
  ],
  [["p", ""]],
  [["com", "  // 超出窗口配额时拒绝"]],
  [
    ["p", "  "],
    ["kw", "if"],
    ["p", " (live.length >= limit) "],
    ["kw", "throw new"],
    ["p", " "],
    ["fn", "Error"],
    ["p", "("],
    ["str", '"rate_limited"'],
    ["p", ")"],
  ],
  [
    ["p", "  live."],
    ["fn", "push"],
    ["p", "(now)"],
  ],
  [["p", "}"]],
];

const TONE: Record<string, string> = {
  kw: "text-syn-key",
  fn: "text-syn-fn",
  str: "text-syn-str",
  com: "text-syn-com",
  num: "text-syn-num",
  p: "text-foreground/80",
};

function ActivityBar() {
  const icons = [Files, Search, GitBranch, Bug, Blocks];
  return (
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-chrome py-2">
      <button className="relative flex size-10 items-center justify-center rounded-md bg-surface">
        <span className="absolute left-0 h-6 w-[2px] rounded-r bg-primary" />
        <img src={logo.url} alt="心流·驭光面板" className="size-5" />
      </button>
      {icons.map((Icon, i) => (
        <button
          key={i}
          className="flex size-10 items-center justify-center rounded-md text-chrome-foreground hover:bg-surface hover:text-foreground"
        >
          <Icon className="size-[18px]" />
        </button>
      ))}
      <button className="mt-auto flex size-10 items-center justify-center rounded-md text-chrome-foreground hover:bg-surface hover:text-foreground">
        <Settings className="size-[18px]" />
      </button>
    </nav>
  );
}

function Index() {
  const [isLight, setIsLight] = useState(false);

  return (
    <main
      className={`${isLight ? "light" : ""} flex h-screen flex-col overflow-hidden bg-background text-foreground`}
    >
      {/* title bar */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border bg-chrome px-3">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-destructive/70" />
          <span className="size-3 rounded-full bg-warning/70" />
          <span className="size-3 rounded-full bg-success/70" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md bg-surface px-3 py-1 text-[11px] text-muted-foreground">
          <Search className="size-3" />
          iflow-harness — 搜索文件与命令
        </div>
        <button
          type="button"
          onClick={() => setIsLight((current) => !current)}
          className="flex size-7 items-center justify-center rounded-md text-chrome-foreground transition-colors hover:bg-surface hover:text-foreground"
          title={isLight ? "切换到深色主题" : "切换到浅色主题"}
          aria-label={isLight ? "切换到深色主题" : "切换到浅色主题"}
        >
          {isLight ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </button>
        <Bell className="size-3.5 text-chrome-foreground" />
      </div>

      <div className="flex min-h-0 flex-1">
        <ActivityBar />
        <HarnessPanel />

        {/* editor area */}
        <section className="flex min-w-0 flex-1 flex-col bg-editor">
          <div className="flex h-9 shrink-0 items-center border-b border-border bg-chrome text-[12px]">
            <div className="flex h-full items-center gap-2 border-r border-border bg-editor px-3 text-foreground">
              <FileCode2 className="size-3.5 text-syn-fn" />
              rate-limiter.ts
              <Circle className="size-2 fill-current text-primary" />
            </div>
            <div className="flex h-full items-center gap-2 border-r border-border px-3 text-muted-foreground">
              <FileCode2 className="size-3.5" />
              chat.ts
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-border px-4 py-1.5 font-mono text-[11px] text-muted-foreground">
            src <ChevronDown className="size-3 -rotate-90" /> lib{" "}
            <ChevronDown className="size-3 -rotate-90" />{" "}
            <span className="text-foreground/70">rate-limiter.ts</span>
          </div>

          <div className="flex-1 overflow-auto px-2 py-3 font-mono text-[12.5px] leading-[1.75]">
            {CODE.map((line, i) => (
              <div key={i} className="flex hover:bg-surface/40">
                <span className="w-10 shrink-0 select-none pr-3 text-right text-syn-com">
                  {i + 11}
                </span>
                <span className="whitespace-pre">
                  {line.map(([t, text], j) => (
                    <span key={j} className={TONE[t]}>
                      {text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
            <div className="mt-4 ml-10 inline-flex items-center gap-2 rounded-md border border-primary/35 bg-primary/10 px-2.5 py-1 text-[11px] text-foreground/80">
              <img src={logo.url} alt="" className="size-3.5" aria-hidden />
              由心流·驭光在 14:02 修改 · 可在面板中一键回退
            </div>
          </div>
        </section>
      </div>

      {/* status bar */}
      <footer className="flex h-6 shrink-0 items-center gap-4 bg-primary px-3 text-[11px] text-primary-foreground">
        <span className="inline-flex items-center gap-1">
          <GitBranch className="size-3" /> main*
        </span>
        <span>行 14，列 22</span>
        <span>TypeScript</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <MessageSquare className="size-3" /> 心流·驭光：正在生成 · 智能模式 · iflow-max-2
        </span>
      </footer>
    </main>
  );
}
