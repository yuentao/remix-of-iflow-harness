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

const FEATURES = [
  {
    icon: MessageSquare,
    title: "结构化消息流",
    desc: "把 Agent 的思考、工具调用、任务清单与代码改动整理成可读的时间线，不再面对一团黑盒输出。",
  },
  {
    icon: ShieldCheck,
    title: "工具审批",
    desc: "写入文件、执行命令、调用 API 前都会弹出审批卡片，支持按次、按会话或永久授权。",
  },
  {
    icon: Eye,
    title: "行级改动对比",
    desc: "直接在编辑器里查看新增与删除，颜色区分、行号对齐，像审阅同事 PR 一样审阅 AI 代码。",
  },
  {
    icon: Undo2,
    title: "一键回退",
    desc: "任何改动都能秒级撤销，回退前自动检查未保存内容，避免 AI 误操作污染代码库。",
  },
  {
    icon: Terminal,
    title: "命令与模型切换",
    desc: "/init、/commit、/model 等快捷命令，配合多模型切换，让不同任务用对的引擎。",
  },
  {
    icon: Zap,
    title: "本地优先",
    desc: "密钥与配置留在你的工作区，支持自建网关，数据不需要经过第三方平台。",
  },
];

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

function ThemeToggle({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex size-7 items-center justify-center rounded-md text-chrome-foreground transition-colors hover:bg-surface hover:text-foreground"
      title={isLight ? "切换到深色主题" : "切换到浅色主题"}
      aria-label={isLight ? "切换到深色主题" : "切换到浅色主题"}
    >
      {isLight ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
    </button>
  );
}

function VSCodeHero({ isLight, onToggle }: { isLight: boolean; onToggle: () => void }) {
  return (
    <div className="flex h-screen shrink-0 flex-col overflow-hidden">
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
        <ThemeToggle isLight={isLight} onToggle={onToggle} />
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
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="relative border-t border-border bg-background px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            让 AI 写代码的过程，像和同事 Pair 一样透明
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            心流·驭光把 Agent 的每一步拆解成可见、可控、可回退的操作，让你在编辑器里放心地把重复劳动交给 AI。
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group stream-in rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
              >
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center">
          <img src={logo.url} alt="心流·驭光" className="size-10" />
          <h3 className="text-xl font-bold text-foreground">准备好接管你的 AI 工作流了吗？</h3>
          <p className="max-w-lg text-sm text-muted-foreground">
            加入早期体验，获取 VSCode 扩展内测资格，以及第一手的工具审批与回退策略文档。
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            预约内测 <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const [isLight, setIsLight] = useState(false);

  return (
    <main
      className={`${isLight ? "light" : ""} min-h-screen flex-col bg-background text-foreground`}
    >
      <VSCodeHero isLight={isLight} onToggle={() => setIsLight((current) => !current)} />
      <FeaturesSection />
    </main>
  );
}
