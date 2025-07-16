import { Button } from "@/components/ui/button";
import { LuShoppingCart } from "react-icons/lu";
import Link from "next/link";
function CartButton(props: { items: number }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="flex justify-center items-center  relative   "
    >
      <Link href="/cart">
        <LuShoppingCart className="" />
        {props.items > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px]">
            {props.items}
          </span>
        )}
      </Link>
    </Button>
  );
}
export default CartButton;
