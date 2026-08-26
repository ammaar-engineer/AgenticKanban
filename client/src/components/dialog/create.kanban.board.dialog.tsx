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
import { Textarea } from "@/components/ui/textarea"

export type CreateKanbanBoardValues = { name: string; description: string }

export function CreateKanbanBoardDialog({
    open,
    onOpenChange,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CreateKanbanBoardValues) => void
}) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return
        onSubmit({ name: name.trim(), description: description.trim() })
        setName("")
        setDescription("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Board</DialogTitle>
                    <DialogDescription>
                        Give description and name
                    </DialogDescription>
                </DialogHeader>

                <form id="create-board-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="board-name">Nama</Label>
                        <Input
                            id="board-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Example: Creating simple landing page"
                            autoFocus
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="board-desc">Deskripsi</Label>
                        <Textarea
                            id="board-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Example: Kanban for landing page"
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <Button type="submit" form="create-board-form" disabled={!name.trim()}>
                        Create Board
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
