import { toast } from "@/components/ui/toast"

export class ToastCategory {
    static success(message: string) {
        toast.add({ title: "Success", description: message, type: "success" })
    }

    static error(message: string) {
        toast.add({ title: "Failed", description: message, type: "error" })
    }

    static warning(message: string) {
        toast.add({ title: "Warning", description: message, type: "warning" })
    }

    static info(message: string) {
        toast.add({ title: "Info", description: message, type: "info" })
    }
}
