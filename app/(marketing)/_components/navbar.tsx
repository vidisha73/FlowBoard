import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div
      className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center"
      data-testid="navbar_wrapper"
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo href="/" />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button
            size="sm"
            variant="outline"
            asChild
            data-testid="navbar_login_button"
          >
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button size="sm" asChild data-testid="navbar_get_FlowBoard_button">
            <Link href="/sign-up">Get FlowBoard for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
