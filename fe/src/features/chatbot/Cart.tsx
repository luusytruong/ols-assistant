import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

interface CartProps {
  onCheckout: (message: string) => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;

    const cartSummary = items
      .map((item) => `- ${item.quantity} x ${item.name}`)
      .join("\n");

    const message = `Tạo đơn hàng:\n${cartSummary}`;

    onCheckout(message);
    clearCart();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <ShoppingCart className="group-hover:text-primary transition-colors" />
          {totalItems > 0 && (
            <Badge
              className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-primary-foreground font-bold text-[10px]"
              variant="default"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 overflow-hidden ms-4"
      >
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2">Giỏ hàng ({totalItems})</h3>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 />
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-1.5">
          {items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <ShoppingCart size={40} className="mx-auto mb-2 opacity-20" />
              <p className="opacity-20 text-sm">Giỏ hàng trống</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 group"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <ButtonGroup className="items-center">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                    >
                      <Minus size={12} />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      readOnly
                      className="w-8 h-8"
                    />
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </Button>
                  </ButtonGroup>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm">
                Tổng cộng:
              </span>
              <span className="text-primary font-semibold">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Đặt hàng ngay
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
