import { Agent, OpenAIConversationsSession, run } from "@openai/agents";
import * as readline from "readline";

async function startChatbot(agent: Agent) {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("      🤖 CHATBOT ĐA NĂNG - OPENAI AGENTS SDK              ");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("⌨️  Gõ 'exit' để thoát");
  console.log("══════════════════════════════════════════════════════════");
  console.log("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const session = new OpenAIConversationsSession();

  const askQuestion = () => {
    rl.question("👤 Bạn: ", async (input) => {
      const userInput = input.trim();

      if (userInput.toLowerCase() === "exit") {
        console.log("\n👋 Tạm biệt! Hẹn gặp lại!");
        rl.close();
        return;
      }

      if (!userInput) {
        askQuestion();
        return;
      }

      try {
        console.log("🤖 Bot: Đang xử lý...\r");

        const result = await run(agent, userInput, {
          session,
          maxTurns: 15,
        });

        process.stdout.write("\x1b[1A\x1b[2K");

        console.log(`🤖 Bot: ${result.finalOutput}`);
        console.log("");
      } catch (error) {
        console.error(
          "❌ Lỗi:",
          error instanceof Error ? error.message : "Unknown error",
        );
        console.log("");
      }

      askQuestion();
    });
  };

  askQuestion();
}

export { startChatbot };
