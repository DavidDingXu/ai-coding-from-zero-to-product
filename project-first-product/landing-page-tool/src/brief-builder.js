const DEFAULT_VALUE = "暂未填写";

export function buildBrief(input = {}) {
  const idea = clean(input.idea);
  if (!idea) {
    throw new Error("产品想法不能为空");
  }

  const audience = clean(input.audience) || DEFAULT_VALUE;
  const coreFeatures = clean(input.coreFeatures) || DEFAULT_VALUE;
  const style = clean(input.style) || DEFAULT_VALUE;
  const constraints = clean(input.constraints) || "先做最小可用版本，避免复杂依赖";
  const title = makeTitle(idea);

  const brief = [
    `产品名称：${title}`,
    `一句话想法：${idea}`,
    `目标用户：${audience}`,
    `核心功能：${coreFeatures}`,
    `体验风格：${style}`,
    `限制条件：${constraints}`
  ].join("\n");

  const prompt = [
    "你是资深产品工程师和前端工程师。",
    "我要用 AI 编程工具做一个小产品，请基于下面的产品简报协助我开发。",
    "",
    brief,
    "",
    "请先澄清需求，再生成实现计划。",
    "实现时优先做最小可用版本，不要引入不必要的复杂依赖。",
    "完成后必须说明如何运行和验证。"
  ].join("\n");

  return { title, brief, prompt };
}

function clean(value) {
  return String(value ?? "").trim();
}

function makeTitle(idea) {
  const normalized = idea
    .replace(/^做一个/, "")
    .replace(/^做款/, "")
    .replace(/^开发一个/, "")
    .replace(/^开发款/, "")
    .replace(/^给(.+?)用的/, "$1")
    .replace(/[，。,.].*$/, "")
    .trim();

  return normalized || "AI 编程小产品";
}
