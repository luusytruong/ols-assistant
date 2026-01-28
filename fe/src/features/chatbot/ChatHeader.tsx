import { Ellipsis, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/useChatStore";

export function ChatHeader() {
  const { clearChat } = useChatStore();

  return (
    <div className="w-full flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-2 h-11 items-center justify-center rounded-full">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-full w-11 aspect-square"
          />
          <img src="/name.png" alt="name" className="h-auto w-18" />
        </div>
        {/* <div>
          <h1 className="text-lg font-semibold">OLS Assistant</h1>
          <p className="text-xs text-muted-foreground">
            Luôn sẵn sàng hỗ trợ bạn
          </p>
        </div> */}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem
            onClick={clearChat}
            className="text-destructive focus:text-destructive w-fit"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Xóa lịch sử trò chuyện</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
