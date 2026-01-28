import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  ShoppingCart,
  Hash,
  Truck,
  Banknote,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const imageUrl = "https://truongdev.site/tea/uploads/";

// ================== TYPES ==================
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  code: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
  timestamp: number;
  type?: "text" | "product" | "order";
  toolResult?: {
    success: boolean;
    data: Product | Product[] | Order | Order[];
  };
  sendMessage: (message: string) => void;
}

// ================== RENDER ITEMS ==================
function renderItems(
  type: "text" | "product" | "order" | undefined,
  data: Product | Product[] | Order | Order[] | undefined,
  sendMessage: (message: string) => void,
) {
  if (!type || !data) return null;

  const items = Array.isArray(data) ? data : [data];

  if (type === "product") {
    return (
      <div className="flex flex-wrap gap-2 my-2">
        {items.map((item, i) => (
          <ProductCard
            key={i}
            {...(item as Product)}
            sendMessage={sendMessage}
          />
        ))}
      </div>
    );
  }

  if (type === "order") {
    return (
      <div className="flex flex-wrap gap-2 my-2">
        {items.map((item, i) => (
          <OrderCard key={i} {...(item as Order)} />
        ))}
      </div>
    );
  }

  return null;
}

// ================== PRODUCT CARD ==================
function ProductCard({
  id,
  name,
  price,
  image,
  sendMessage,
}: Product & { sendMessage: (message: string) => void }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <Card key={id} className="max-w-48 w-fit relative" size="sm">
      <img
        src={imageUrl + image}
        alt={name}
        title={name}
        className="aspect-video w-full max-w-72 object-cover"
      />
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
        <Badge variant="secondary">{formatPrice(price)}</Badge>
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={() => sendMessage(`Chi tiết ${name}`)}
        >
          Chi tiết
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{name}</CardTitle>
      </CardHeader>
      <CardFooter className="gap-2">
        <Input
          type="number"
          className="w-16"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
        />
        <Button
          className="flex-1"
          onClick={() =>
            sendMessage(`Thêm ${name} số lượng ${quantity} vào đơn hàng`)
          }
        >
          <ShoppingCart />
          Thêm
        </Button>
      </CardFooter>
    </Card>
  );
}

// ================== ORDER CARD ==================
function OrderCard({ code, totalPrice, status, items }: Order) {
  if (!code) return null;
  return (
    <Card className="w-1/3 min-w-50 relative" size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Hash size={16} />
          {code}
        </CardTitle>
        <CardDescription className="">
          <div className="flex items-center gap-1">
            <Truck size={16} />
            {status}
          </div>
          <div className="flex items-center gap-1">
            <Banknote size={16} />
            {formatPrice(totalPrice)}
          </div>
          {Array.isArray(items) &&
            items.map((i) => (
              <Badge
                key={i.productId}
                className="mt-1.5"
              >{`${i.productName} x ${i.quantity}`}</Badge>
            ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// ================== CHAT MESSAGE ==================
export function ChatMessage({
  role,
  content,
  type,
  toolResult,
  timestamp,
  sendMessage,
}: ChatMessageProps) {
  const isUser = role === "user";
  const data = toolResult?.data;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={clsx(
          "flex flex-col space-y-1 group",
          isUser && "max-w-[85%]",
        )}
      >
        <div
          className={clsx(
            "relative rounded-3xl text-base leading-relaxed",
            isUser
              ? "px-3 py-1.75 bg-primary text-primary-foreground rounded-br-xs"
              : "",
          )}
        >
          <div
            className={clsx(
              "prose prose-base max-w-none dark:prose-invert",
              "prose-p:leading-relaxed prose-pre:bg-muted-foreground/10 prose-pre:text-foreground prose-code:text-primary",
              isUser
                ? "prose-p:text-primary-foreground"
                : "prose-p:text-foreground",
            )}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {renderItems(type, data, sendMessage)}

        <div
          className={clsx(
            "w-full flex items-center",
            isUser ? "justify-end" : "justify-between",
          )}
        >
          <span className="text-[10px] opacity-50 bottom-1 right-3">
            {new Date(timestamp).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>

          {!isUser && (
            <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
