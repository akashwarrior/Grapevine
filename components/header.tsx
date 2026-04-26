"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletButton } from "@/components/wallet-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const NAV_LINKS = ["About", "Communities", "Leaderboard"] as const

export function Header() {
  const { data } = useSession();
  const user = data?.user;

  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      }
    });
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b border-border/30 backdrop-blur-2xl bg-background/95 supports-backdrop-filter:bg-background/80"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Button
            variant="link"
            aria-label="Grapevine home"
            onClick={() => window.location.pathname !== "/" && router.push("/")}
            className="font-medium text-lg tracking-tight hover:opacity-80 transition-[opacity,translate] hover:no-underline"
          >
            Grapevine
          </Button>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(nav =>
              <Link
                key={nav}
                prefetch={false}
                href={`/${nav.toLowerCase()}`}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium relative group py-1"
              >
                {nav}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-[width] duration-150" />
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                render={
                  <Link
                    href="/create-market"
                    prefetch={false}
                  >
                    Create Market
                  </Link>
                }
              />

              <Button
                size="sm"
                className="hidden md:flex"
                render={
                  <Link
                    href="/portfolio"
                    prefetch={false}
                  >
                    Portfolio
                  </Link>
                }
              />

              {/* Wallet Connect Button - only show when authenticated */}
              <div className="hidden md:block">
                <WalletButton />
              </div>

              <ThemeToggle />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      aria-label="User menu"
                    >
                      <Avatar className="size-9">
                        <AvatarImage
                          src={user.image || undefined}
                          alt={
                            user.name ||
                            user.email.split("@")[0] ||
                            "User"
                          }
                        />
                        <AvatarFallback>
                          {(
                            user.name ||
                            user.email.split("@")[0]
                          )
                            .charAt(0)
                            .toUpperCase() || <User className="size-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/portfolio"
                        prefetch={false}
                      >
                        Portfolio
                      </Link>
                    }
                  />

                  <DropdownMenuItem
                    render={
                      <Link
                        href="/create-market"
                        prefetch={false}
                      >
                        Create Market
                      </Link>
                    }
                  />

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                size="sm"
                nativeButton={false}
                className="text-xs px-4"
                render={
                  <Link
                    href="/login"
                    prefetch={false}
                  >
                    Sign Up / Login
                  </Link>
                }
              />
            </>
          )}

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden"
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Open menu"
                >
                  <Menu className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52">
              {NAV_LINKS.map(nav =>
                <DropdownMenuItem
                  key={nav}
                  render={
                    <Link
                      href={`/${nav.toLowerCase()}`}
                      prefetch={false}
                    >
                      {nav}
                    </Link>
                  }
                />
              )}

              <DropdownMenuSeparator />

              {user ? (
                <>
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/create-market"
                        prefetch={false}
                      >
                        Create Market
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link
                        href="/portfolio"
                        prefetch={false}
                      >
                        Portfolio
                      </Link>
                    }
                  />

                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <WalletButton />
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  render={
                    <Link
                      href="/login"
                      prefetch={false}
                    >
                      Sign Up / Login
                    </Link>
                  }
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
