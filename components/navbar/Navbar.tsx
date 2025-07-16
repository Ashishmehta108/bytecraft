"use client";
import { CartItem, useCart } from "../CartContext";
import Container from "../global/Container";
import { ModeToggle } from "../Modetoggle";
import CartButton from "./CartButton";
import LinksDropdown from "./LinksDropdown";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import { Suspense } from "react";
function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav className="border-b bg-white dark:bg-neutral-950  top-0">
      <Container className="flex  sm:flex-row justify-between sm:items-center  flex-wrap py-8 gap-4">
        <Logo />
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className="flex gap-4 items-center">
          <ModeToggle />
          <CartButton items={totalItems} />
          <LinksDropdown />
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
