import { getServerSideUser } from "@/lib/payload-utlis";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Cart from "../cart/Cart";
import MaxWidthWrapper from "../MaxWidthWrapper";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "../ui/button";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import UserNav from "./UserNav";
import { ThemeSwitch } from "../ui/theme-switch";

const Navbar = async () => {
  const nextCookies = await cookies();

  const { user } = await getServerSideUser(nextCookies);

  return (
    <div className="sticky top-0 z-50 border-b supports-backdrop-blur:bg-background/90 border-foreground/10 backdrop-blur">
      <header className="relative w-full">
        <MaxWidthWrapper>
          <div className="">
            <div className="flex items-center h-16">
              <MobileNav user={user} />
              <div className="ml-4 lg:ml-0">
                <Link href="/">
                  <div className="relative w-12 h-12">
                    <Image src="/logo.png" fill alt="Digibee Logo" />
                  </div>
                </Link>
              </div>
              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="flex items-center ml-auto">
                <UserNav
                  user={user}
                  className="hidden lg:flex lg:flex-1 lg:justify-end lg:space-x-6 lg:items-center"
                />
                <div className="flow-root ml-4 lg:ml-6">
                  <ThemeSwitch />
                </div>
                <div className="flow-root ml-4 lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
