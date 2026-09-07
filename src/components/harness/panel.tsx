import { useState } from "react";
import {
  Bot,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Clock,
  Columns2,
  FileCode2,
  History,
  Loader2,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SquareTerminal,
  Undo2,
  X,
  Zap,
} from "lucide-react";
import logo from "@/assets/iflow.svg.asset.json";

/* ---------- shared bits ---------- */

function Chip({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "success" | "warning" | "primary" | "info";
}) {
  const tones: Record<string, string> = {
    muted: "bg-surface text-muted-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    primary: "bg-primary/18 text-primary-foreground",
    info: "bg-info/15 text-info",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function FileRef({ path }: { path: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-sm font-mono text-[11px] text-info underline decoration-info/30 underline-offset-2 hover:decoration-info">
      <FileCode2 className="size-3" />
      {path}
    </button>
  );
}

/* ---------- message blocks ---------- */

function UserMessage({ text }: { text: string }) {
  return (
    <div className="stream-in flex justify-end">
      <div className="max-w-[85%] rounded-xl rounded-br-sm bg-surface-2 px-3 py-2 text-[13px] leading-relaxed text-foreground">
        {text}
      </div>
    </div>
  );
}

function Thinking() {
  const [open, setOpen] = useState(false);
  return (
    <div className="stream-in rounded-lg border border-border/70 bg-panel/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        <Brain className="size-3.5 text-primary" />
        思考过程
        <span className="ml-auto font-mono text-[10px] opacity-60">8s · 已收起</span>
      </button>
      {open && (
        <p className="border-t border-border/60 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
          先定位 <span className="font-mono">rateLimiter</span> 的实现位置，确认它是否在请求层被复用。
          若窗口计数使用了全局变量，需要改为按 key 隔离，再补一组边界测试。
        </p>
      )}
    </div>
  );
}

function ToolCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="stream-in overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-3 py-2">
        <SquareTerminal className="size-3.5 text-primary" />
        <span className="text-[12px] font-semibold">检索文件</span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          grep "rateLimiter" src/**
        </span>
        <span className="ml-auto">
          <Chip tone="success">
            <Check className="size-2.5" /> 已完成
          </Chip>
        </span>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 border-t border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        操作输出（3 处匹配）
      </button>
      {open && (
        <pre className="border-t border-border/60 bg-editor px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {`src/lib/rate-limiter.ts:12
src/routes/api/chat.ts:41
src/lib/rate-limiter.test.ts:5`}
        </pre>
      )}
    </div>
  );
}

function TaskList() {
  const tasks = [
    { label: "定位限流实现与调用点", state: "done" },
    { label: "按 key 隔离计数窗口", state: "doing" },
    { label: "补充边界测试用例", state: "todo" },
  ] as const;
  return (
    <div className="stream-in rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold">
        <CircleDot className="size-3.5 text-primary" />
        任务清单
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">1 / 3</span>
      </div>
      <ul className="space-y-1.5">
        {tasks.map((t) => (
          <li key={t.label} className="flex items-center gap-2 text-[12px]">
            {t.state === "done" && <CheckCircle2 className="size-3.5 shrink-0 text-success" />}
            {t.state === "doing" && (
              <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
            )}
            {t.state === "todo" && (
              <span className="size-3.5 shrink-0 rounded-full border border-border" />
            )}
            <span
              className={
                t.state === "done" ? "text-muted-foreground line-through" : "text-foreground"
              }
            >
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DiffCard() {
  const [reverted, setReverted] = useState(false);
  const lines = [
    { n: "11", t: "ctx", c: "const windows = new Map<string, number[]>()" },
    { n: "12", t: "del", c: "let hits: number[] = []" },
    { n: "12", t: "add", c: "const hits = windows.get(key) ?? []" },
    { n: "13", t: "ctx", c: "const now = Date.now()" },
    { n: "14", t: "del", c: "hits = hits.filter((t) => now - t < windowMs)" },
    { n: "14", t: "add", c: "const live = hits.filter((t) => now - t < windowMs)" },
    { n: "15", t: "add", c: "windows.set(key, live)" },
  ];
  return (
    <div className="stream-in overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 px-3 py-2">
        <FileCode2 className="size-3.5 text-primary" />
        <FileRef path="src/lib/rate-limiter.ts" />
        <span className="ml-auto flex items-center gap-2 font-mono text-[10px]">
          <span className="text-diff-add-fg">+3</span>
          <span className="text-diff-del-fg">−2</span>
        </span>
      </div>
      <div className="border-y border-border/60 bg-editor font-mono text-[11px] leading-[1.7]">
        <div className="px-3 py-1 text-syn-com">@@ 折叠了 10 行未变更内容 @@</div>
        {lines.map((l, i) => (
          <div
            key={i}
            className={`flex gap-3 px-3 ${
              l.t === "add" ? "bg-diff-add" : l.t === "del" ? "bg-diff-del" : ""
            }`}
          >
            <span className="w-6 shrink-0 select-none text-right text-syn-com">{l.n}</span>
            <span
              className={`w-2 shrink-0 select-none ${
                l.t === "add"
                  ? "text-diff-add-fg"
                  : l.t === "del"
                    ? "text-diff-del-fg"
                    : "text-syn-com"
              }`}
            >
              {l.t === "add" ? "+" : l.t === "del" ? "−" : " "}
            </span>
            <span className="whitespace-pre text-foreground/90">{l.c}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        {reverted ? (
          <Chip tone="warning">
            <Undo2 className="size-2.5" /> 此改动已回退
          </Chip>
        ) : (
          <>
            <button
              onClick={() => setReverted(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <Undo2 className="size-3" /> 回退此改动
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-surface-2">
              <Columns2 className="size-3" /> 文件对比
            </button>
            <span className="text-[10px] text-muted-foreground">在编辑器中并排查看</span>
          </>
        )}
      </div>
    </div>
  );
}

function SubAgentCard() {
  const [open, setOpen] = useState(false);
  const steps = [
    { label: "读取 rate-limiter.test.ts 现有断言", state: "done" },
    { label: "生成并发窗口边界用例", state: "done" },
    { label: "运行 vitest 校验用例通过", state: "doing" },
  ] as const;
  return (
    <div className="stream-in overflow-hidden rounded-lg border border-info/40 bg-card">
      <div className="flex items-center gap-2 px-3 py-2">
        <Bot className="size-3.5 text-info" />
        <span className="text-[12px] font-semibold">子智能体 · 测试编写</span>
        <span className="ml-auto">
          <Chip tone="info">
            <Loader2 className="size-2.5 animate-spin" /> 运行中 2/3
          </Chip>
        </span>
      </div>
      <div className="border-t border-border/60 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          目标：为按 key 隔离后的限流器补齐边界测试 · 模型
          <span className="ml-1 font-mono">iflow-coder-pro</span>
        </p>
        <ul className="mt-2 space-y-1.5">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-[12px]">
              {s.state === "done" ? (
                <CheckCircle2 className="size-3.5 shrink-0 text-success" />
              ) : (
                <Loader2 className="size-3.5 shrink-0 animate-spin text-info" />
              )}
              <span
                className={s.state === "done" ? "text-muted-foreground" : "text-foreground"}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 border-t border-border/60 px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        子智能体日志
      </button>
      {open && (
        <pre className="border-t border-border/60 bg-editor px-3 py-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
          {`> spawn sub-agent "test-writer"
> tool: read_file src/lib/rate-limiter.test.ts
> tool: write_file src/lib/rate-limiter.test.ts (+34)
> tool: run vitest src/lib/rate-limiter.test.ts`}
        </pre>
      )}
    </div>
  );
}


function ApprovalCard() {
  const [decision, setDecision] = useState<string | null>(null);
  if (decision) {
    return (
      <div className="stream-in rounded-lg border border-border bg-panel/60 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="font-mono">// 审批结果：{decision}，已写回对话记录</span>
      </div>
    );
  }
  return (
    <div className="stream-in glow-ring rounded-lg border border-primary/40 bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
        <ShieldCheck className="size-3.5 text-primary" />
        <span className="text-[12px] font-semibold">需要你的审批</span>
        <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-warning">
          <Clock className="size-3" /> 04:31
        </span>
      </div>
      <div className="space-y-1.5 px-3 py-2.5 text-[12px]">
        <p className="text-foreground/90">
          Agent 请求写入文件 <FileRef path="src/lib/rate-limiter.test.ts" />
        </p>
        <p className="text-[11px] text-muted-foreground">
          工具：<span className="font-mono">write_file</span> · 超时 5 分钟后自动拒绝
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-border/60 px-3 py-2">
        <button
          onClick={() => setDecision("允许一次")}
          className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90"
        >
          允许一次
        </button>
        <button
          onClick={() => setDecision("本次会话始终允许")}
          className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] hover:bg-surface-2"
        >
          本次会话始终允许
        </button>
        <button
          onClick={() => setDecision("拒绝")}
          className="rounded-md border border-destructive/40 px-2.5 py-1 text-[11px] text-destructive hover:bg-destructive/10"
        >
          拒绝
        </button>
        <button
          onClick={() => setDecision("取消")}
          className="rounded-md px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          取消
        </button>
      </div>
    </div>
  );
}

function AgentReply() {
  return (
    <div className="stream-in space-y-2 text-[13px] leading-relaxed text-foreground/90">
      <p>
        限流器的计数窗口原本是模块级共享变量，多个 key 会互相污染。我已改为按 key 隔离，并保留窗口
        清理逻辑：
      </p>
      <ul className="ml-4 list-disc space-y-1 text-[12px] text-muted-foreground marker:text-primary">
        <li>每个 key 独立维护时间戳数组</li>
        <li>过期时间戳在读取时清理，避免内存增长</li>
      </ul>
      <p className="flex items-center gap-1">
        正在补充测试
        <span className="caret-blink inline-block h-3.5 w-[6px] translate-y-[1px] bg-primary" />
      </p>
    </div>
  );
}

/* ---------- composer ---------- */

const COMMANDS = [
  { name: "/init", desc: "生成项目说明文件 IFLOW.md" },
  { name: "/commit", desc: "根据暂存改动生成提交信息" },
  { name: "/model", desc: "切换当前会话使用的模型" },
  { name: "/config", desc: "打开 API 凭据与配置管理" },
];

const MODES: Array<{ key: string; label: string; desc: string }> = [
  { key: "smart", label: "智能", desc: "AI 评估风险后决定是否确认" },
  { key: "yolo", label: "免确认", desc: "所有工具直接执行" },
  { key: "default", label: "标准", desc: "执行前均需确认" },
  { key: "plan", label: "规划", desc: "只读，仅分析与规划" },
];

const MODELS = ["iflow-max-2", "iflow-coder-pro", "qwen3-coder-480b", "deepseek-v3.2"];

function Composer() {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState(MODES[0]!);
  const [model, setModel] = useState(MODELS[0]!);
  const [openMenu, setOpenMenu] = useState<"mode" | "model" | null>(null);
  const showCommands = value.startsWith("/");
  const matches = COMMANDS.filter((c) => c.name.startsWith(value.trim()));

  return (
    <div className="relative border-t border-border bg-panel px-2.5 pb-2.5 pt-2">
      {showCommands && matches.length > 0 && (
        <div className="absolute inset-x-2.5 bottom-full mb-1 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
          {matches.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setValue(c.name + " ")}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] ${
                i === 0 ? "bg-accent" : "hover:bg-accent/60"
              }`}
            >
              <span className="font-mono text-primary">{c.name}</span>
              <span className="truncate text-[11px] text-muted-foreground">{c.desc}</span>
              {i === 0 && (
                <kbd className="ml-auto rounded border border-border px-1 font-mono text-[9px] text-muted-foreground">
                  Tab
                </kbd>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border bg-editor focus-within:border-primary/60">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="描述你的需求…  Enter 发送 · Shift+Enter 换行 · / 唤起命令"
          className="w-full resize-none bg-transparent px-3 py-2.5 text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        <div className="flex items-center gap-1.5 px-2 pb-2">
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "mode" ? null : "mode")}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] hover:bg-surface-2"
            >
              <Zap className="size-3 text-primary" />
              {mode.label}
              <ChevronDown className="size-3 opacity-60" />
            </button>
            {openMenu === "mode" && (
              <div className="absolute bottom-full z-20 mb-1 w-56 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => {
                      setMode(m);
                      setOpenMenu(null);
                    }}
                    className="flex w-full flex-col items-start px-3 py-1.5 text-left hover:bg-accent"
                  >
                    <span className="text-[12px]">
                      {m.label}
                      {m.key === mode.key && <Check className="ml-1 inline size-3 text-primary" />}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] hover:bg-surface-2"
            >
              {model}
              <ChevronDown className="size-3 opacity-60" />
            </button>
            {openMenu === "model" && (
              <div className="absolute bottom-full z-20 mb-1 w-52 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
                <div className="px-3 py-1.5 text-[10px] text-muted-foreground">切换模型</div>

                {MODELS.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setModel(m);
                      setOpenMenu(null);
                    }}
                    className="flex w-full items-center px-3 py-1.5 text-left font-mono text-[11px] hover:bg-accent"
                  >
                    {m}
                    {m === model && <Check className="ml-auto size-3 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
            <X className="size-3" /> 停止生成
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- panel ---------- */

const API_CONFIGS = [
  { name: "工作密钥", endpoint: "api.iflow.cn/v1", masked: "sk-…f2a9" },
  { name: "个人密钥", endpoint: "api.iflow.cn/v1", masked: "sk-…7b31" },
  { name: "自建网关", endpoint: "gateway.internal/v1", masked: "sk-…0c4d" },
];

const SESSIONS = [
  { title: "限流器按 key 隔离计数", time: "刚刚", msgs: 12 },
  { title: "重构鉴权中间件", time: "今天 10:24", msgs: 31 },
  { title: "修复导出 CSV 乱码", time: "昨天 18:07", msgs: 8 },
  { title: "接入支付回调 webhook", time: "9月4日", msgs: 45 },
];

export function HarnessPanel() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState(API_CONFIGS[0]!);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [session, setSession] = useState(SESSIONS[0]!);

  return (
    <aside className="flex h-full w-[420px] shrink-0 flex-col border-r border-border bg-panel">
      {/* header */}
      <header className="aurora border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <img src={logo.url} alt="心流·驭光 iFlow Harness 标志" className="size-5" />
          <div className="leading-tight">
            <h1 className="text-[13px] font-extrabold tracking-tight">心流·驭光</h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              iFlow Harness
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-muted-foreground">
            <button className="rounded p-1 hover:bg-surface hover:text-foreground" title="新建会话">
              <Plus className="size-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className={`rounded p-1 hover:bg-surface hover:text-foreground ${
                  settingsOpen ? "bg-surface text-foreground" : ""
                }`}
                title="设置与 API 配置"
                aria-label="设置与 API 配置"
              >
                <Settings2 className="size-4" />
              </button>
              {settingsOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-60 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    API 配置
                  </div>
                  {API_CONFIGS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setApiConfig(c);
                        setSettingsOpen(false);
                      }}
                      className="flex w-full flex-col items-start px-3 py-1.5 text-left hover:bg-accent"
                    >
                      <span className="flex w-full items-center text-[12px] text-foreground">
                        {c.name}
                        {c.name === apiConfig.name && (
                          <Check className="ml-auto size-3 text-primary" />
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {c.endpoint} · {c.masked}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-border">
                    <button className="w-full px-3 py-1.5 text-left text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground">
                      管理配置与凭据…
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
            <button
              onClick={() => setHistoryOpen((o) => !o)}
              className={`flex w-full items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-left text-[11px] hover:bg-surface-2 ${
                historyOpen ? "bg-surface-2" : ""
              }`}
              title="会话历史"
            >
              <History className="size-3 shrink-0 text-primary" />
              <span className="truncate text-foreground">{session.title}</span>
              <ChevronDown className="ml-auto size-3 shrink-0 opacity-60" />
            </button>
            {historyOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 w-72 overflow-hidden rounded-lg border border-border bg-popover panel-shadow">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  会话历史
                </div>
                {SESSIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => {
                      setSession(s);
                      setHistoryOpen(false);
                    }}
                    className="flex w-full flex-col items-start px-3 py-1.5 text-left hover:bg-accent"
                  >
                    <span className="flex w-full items-center gap-2 text-[12px] text-foreground">
                      <span className="truncate">{s.title}</span>
                      {s.title === session.title && (
                        <Check className="ml-auto size-3 shrink-0 text-primary" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {s.time} · {s.msgs} 条消息
                    </span>
                  </button>
                ))}
                <div className="border-t border-border">
                  <button className="w-full px-3 py-1.5 text-left text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground">
                    查看全部会话…
                  </button>
                </div>
              </div>
            )}
          </div>
          <Chip tone="success">
            <span className="size-1.5 rounded-full bg-success" /> 正在生成
          </Chip>
        </div>
      </header>


      {/* stream */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        <UserMessage text="限流器在并发请求下会误判，帮我按 key 隔离计数并补测试。" />
        <Thinking />
        <ToolCard />
        <TaskList />
        <DiffCard />
        <SubAgentCard />

        <ApprovalCard />
        <AgentReply />
      </div>

      <Composer />
    </aside>
  );
}

export { Chip, FileRef, Search };
