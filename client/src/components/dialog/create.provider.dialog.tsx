import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastCategory } from "@/services/toast.category"


export type CreateProviderValues = { name: string; url: string, apiKey: string }

export function CreateProviderDialog({
    open,
    onOpenChange,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CreateProviderValues) => void
}) {
    const [name, setName] = useState("")
    const [url, setUrl] = useState("")
    const [apiKey, setApiKey] = useState("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!url.startsWith('http://') || !url.startsWith("https://")) {
            ToastCategory.warning("Invalid URL")
            return
        }
        onSubmit({ name: name.trim(), url: url.trim(), apiKey: apiKey.trim() })
        setName("")
        setUrl("")
        setApiKey("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Provider</DialogTitle>
                    <DialogDescription>
                        Give name and url
                    </DialogDescription>
                </DialogHeader>

                <form id="create-provider-form" onSubmit={handleSubmit} className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="provider-name">Nama</Label>
                        <Input
                            id="provider-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Example: OpenAI"
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="provider-url">URL</Label>
                        <Input
                            id="provider-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Example: https://api.openai.com"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="provider-api_key">Api key</Label>
                        <Input
                            id="provider-api_key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Example: sk-********"
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <Button type="submit" form="create-provider-form" disabled={!name.trim() || !url.trim()}>
                        Add Provider
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
