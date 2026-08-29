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
import { useProvidersQuery } from "@/hooks/provider.query"

export type CreateAgentValues = {
    name: string
    model_id: string
    provider_id: number
    personality: string
    description: string
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
    const [model_id, setModelId] = useState("")
    const [provider_id, setProviderId] = useState<number | "">("")
    const [personality, setPersonality] = useState("")
    const [description, setDescription] = useState("")

    const {data: providers} = useProvidersQuery()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !model_id.trim() || !provider_id) return
        onSubmit({
            name: name.trim(),
            model_id: model_id.trim(),
            provider_id: Number(provider_id),
            personality: personality.trim(),
            description: description.trim()
        })
        setName("")
        setModelId("")
        setProviderId("")
        setPersonality("")
        setDescription("")
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
                            value={model_id}
                            onChange={(e) => setModelId(e.target.value)}
                            placeholder="Example: gpt-4, claude-opus"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-provider">Provider</Label>
                        <Select value={provider_id === "" ? "" : String(provider_id)} onValueChange={(value) => setProviderId(Number(value))}>
                            <SelectTrigger className="w-full" id="agent-provider">
                                <SelectValue placeholder="Pilih provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {providers?.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
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

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="agent-description">Description</Label>
                        <Textarea
                            className="h-40"
                            id="agent-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this agent does..."
                        />
                    </div>
                </form>

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <Button
                        type="submit"
                        form="create-agent-form"
                        disabled={!name.trim() || !model_id.trim() || !provider_id}
                    >
                        Add Agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
