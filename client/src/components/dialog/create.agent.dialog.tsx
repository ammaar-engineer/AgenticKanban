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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useProviderStore } from "@/stores/providers.store"

export type CreateAgentValues = {
    name: string
    model: string
    provider: string
    personality: string
}

export function CreateAgentDialog({
    open,
    onOpenChange,
    onSubmit,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: CreateAgentValues) => void
}) {
    const [name, setName] = useState("")
    const [model, setModel] = useState("")
    const [provider, setProvider] = useState("")
    const [personality, setPersonality] = useState("")

    const providers = useProviderStore(s => s.providers)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !model.trim() || !provider) return
        onSubmit({
            name: name.trim(),
            model: model.trim(),
            provider,
            personality: personality.trim()
        })
        setName("")
        setModel("")
        setProvider("")
        setPersonality("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Agent</DialogTitle>
                    <DialogDescription>
                        Buat agent baru dengan konfigurasi model dan personality
                    </DialogDescription>
                </DialogHeader>

                <form id="create-agent-form" onSubmit={handleSubmit} className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-name">Nama</Label>
                        <Input
                            id="agent-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Example: Research Assistant"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-model">Model</Label>
                        <Input
                            id="agent-model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="Example: gpt-4, claude-opus"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-provider">Provider</Label>
                        <Select value={provider} onValueChange={(value) => setProvider(value || "")}>
                            <SelectTrigger className="w-full" id="agent-provider">
                                <SelectValue placeholder="Pilih provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {providers.map((p, i) => (
                                    <SelectItem key={i} value={p.name}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-personality">Personality</Label>
                        <Textarea
                            className="h-80"
                            id="agent-personality"
                            value={personality}
                            onChange={(e) => setPersonality(e.target.value)}
                            placeholder="Describe agent personality and behavior..."
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <Button
                        type="submit"
                        form="create-agent-form"
                        disabled={!name.trim() || !model.trim() || !provider}
                    >
                        Add Agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
