import { createDeepSeekLLM } from "../llm/deepseek";
import { tools } from "../tool/weather_tool";
import { createAgent } from "langchain";

async function extractEmployeeNickName(message: string): Promise<string> {
  if (!message || typeof message !== "string") return "";
  const llm = createDeepSeekLLM();
  const prompt =
    "从下面这句话中只提取出员工的昵称，只输出昵称本身，不要任何其他文字、前后缀或解释；" +
    "如果无法识别出明确的员工昵称，就返回空字符串。\n\n" +
    `用户输入：${message}`;
  const res = await llm.invoke(prompt);
  const content = res.content;
  const text = typeof content === "string" ? content : String(content ?? "");
  return text.trim();
}

async function getWeatherByCity(city: string): Promise<string> {
  if (!city || typeof city !== "string") {
    throw new Error("city is required");
  }
  const weatherAgent = createAgent({
    model: createDeepSeekLLM(),
    tools: tools,
    responseFormat: undefined,
    middleware: [],
  });
  const result = await weatherAgent.invoke({
    messages: [{ role: "user", content: `查询${city}的天气` }],
  });
  const messages = result.messages as any[];
  if (!Array.isArray(messages) || messages.length === 0) return "";
  const last = messages[messages.length - 1];
  const content = last?.content;
  return typeof content === "string" ? content : content != null ? String(content) : "";
}

export { extractEmployeeNickName, getWeatherByCity };
