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

export type CreateLayerValues = { name: string }

export function CreateLayerDialog({
    open,
    onOpenChange,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CreateLayerValues) => void
}) {
    const [name, setName] = useState("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim() })
        setName("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Layer</DialogTitle>
                    <DialogDescription>
                        Beri nama untuk layer baru di board ini.
                    </DialogDescription>
                </DialogHeader>

                <form id="create-layer-form" onSubmit={handleSubmit} className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="layer-name">Nama</Label>
                        <Input
                            id="layer-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Misal: Layer init struktur folder"
                            autoFocus
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <Button type="submit" form="create-layer-form" disabled={!name.trim()}>
                        Create Layer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
