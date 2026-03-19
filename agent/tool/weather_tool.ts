import { DynamicTool, DynamicStructuredTool, tool } from "langchain";
import { z } from "zod";

const getWeatherDynamicTool = new DynamicTool({
  name: "getWeatherDynamicTool",
  description:
    "当你需要查询某个城市的天气情况时使用。输入应该是城市名称，如'北京'、'上海'、'New York'。",
  func: async (city: string) => {
    // 模拟天气API调用
    console.log(`正在查询城市 [${city}] 的天气...`);

    // 这里应该是真实的API调用，现在模拟返回数据
    const weathers = {
      北京: "晴朗，气温25°C，空气质量良好",
      上海: "多云，气温28°C，湿度较大",
      广州: "雷阵雨，气温32°C，注意带伞",
      深圳: "阴天，气温30°C，微风",
    };

    // 默认返回
    const result =
      weathers[city as keyof typeof weathers] || `${city} 天气未知，建议查询当地气象局数据`;

    return `🌤️ ${city}天气：${result}`;
  },
});

const getWeatherTool = tool(
  async ({ city, unit }: { city: string; unit?: "celsius" | "fahrenheit" }) => {
    console.log(`正在查询城市 [${city}] 的天气...`);
    return `🌤️ ${city} 天气：25°${unit === "celsius" ? "C" : "F"}`;
  },
  {
    name: "getWeatherTool",
    description: "查询天气",
    schema: z.object({
      city: z.string().describe("城市名称"),
      unit: z.enum(["celsius", "fahrenheit"]).optional().describe("温度单位"),
    }),
  },
);

const getDynamicStructuredTool = new DynamicStructuredTool({
  name: "getDynamicStructuredTool",
  description: "查询天气",
  schema: z.object({
    city: z.string().describe("城市名称"),
    unit: z.enum(["celsius", "fahrenheit"]).optional(),
  }),
  func: async ({ city, unit }: { city: string; unit?: "celsius" | "fahrenheit" }) => {
    return `🌤️ ${city} 天气：25°${unit === "fahrenheit" ? "F" : "C"}`;
  },
});

export const tools = [getDynamicStructuredTool, getWeatherDynamicTool, getWeatherTool];
