import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { CreateProviderDialog, type CreateProviderValues } from "@/components/dialog/create.provider.dialog"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProviderStore, type ProvidersType } from "@/stores/providers.store"

export function ProvidersDashboard() {
    const {mutate, providers} = useProviderStore()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleCreate = (values: CreateProviderValues) => {
        const provider: ProvidersType = {
            name: values.name,
            url: values.url,
        }
        mutate(p => {
            p.providers = [...p.providers, provider]
        })
        setDialogOpen(false)
    }

    const handleDelete = (name: string) => {
        mutate(p => {
            p.providers = p.providers.filter(target => target.name !== name)
        })
    }

    return (
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            {/* Section 1: Action panel */}
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <h1 className="text-lg font-semibold text-foreground">Providers</h1>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus /> Add Provider
                </Button>
            </div>

            {/* Section 2: Content grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {providers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {providers.map((provider, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <CardTitle>{provider.name}</CardTitle>
                                    <CardDescription className="truncate">{provider.url}</CardDescription>
                                    <CardAction>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            aria-label={`Delete ${provider.name}`}
                                            onClick={() => handleDelete(provider.name)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </CardAction>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <h2 className="text-lg font-semibold text-foreground">Belum ada provider</h2>
                        <p>Tambahkan provider pertama kamu.</p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus /> Add Provider
                        </Button>
                    </div>
                )}
            </div>

            <CreateProviderDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
        </div>
    )
}
