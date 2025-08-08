"use client";

import { toast } from "sonner";

export default function ToastWrapper({ message }: { message: string }) {

    if (message) {
        toast(message);
    }
    return <></>
}
