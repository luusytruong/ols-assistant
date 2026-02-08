import z from "zod";

export const AgentResponseSchema = z.object({
  reply: z.string().describe("Lời thoại trả lời khách hàng"),

  type: z
    .enum(["text", "product", "order"])
    .nullable()
    .describe("Dữ liệu của tool nào trả về"),

  toolResult: z
    .string()
    .nullable()
    .describe("Stringify {success, data} from tool"),
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;
