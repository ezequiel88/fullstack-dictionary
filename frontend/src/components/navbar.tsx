"use client"

import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import { User } from "@/types";
import { Skeleton } from "./ui/skeleton";

export const Navbar = () => {
    const { user, signOut, isLoading } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    const getUserInitials = (user: User) => {
        if (user.name) {
            return user.name
                .split(' ')
                .map((name: string) => name[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user.email?.slice(0, 2).toUpperCase() || 'U';
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between px-4 mx-auto">
                {/* Logo */}
                <div className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo Dictionary"
                        width={180}
                        height={40}
                        className="h-10 w-auto"
                    />
                </div>

                {/* Auth Section */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {user && !isLoading ?
                        (<DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-7 flex items-center gap-3 p-0 pl-3">
                                    <div className="flex flex-col items-start space-y-1 leading-none">
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="font-medium">
                                            {getUserInitials(user)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        {user.name && (
                                            <p className="font-medium">{user.name}</p>
                                        )}
                                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        )
                        :
                        <Skeleton className="h-10 w-10 rounded-full" />
                    }
                </div>
            </div>
        </nav>
    );
};