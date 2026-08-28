import { Globe, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import { CreateProviderDialog, type CreateProviderValues } from "@/components/dialog/create.provider.dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProviderStore, type ProvidersType } from "@/stores/providers.store"

export function ProvidersDashboard() {
    const { mutate, providers } = useProviderStore()
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {providers.map((provider, i) => (
                            <Card
                                key={i}
                                className="group relative flex-row gap-3 pl-4 rounded-xl pt-4 py-4 transition-colors"
                            >
                                {/* Delete — top-right, hidden sampai hover */}
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Delete ${provider.name}`}
                                    onClick={() => handleDelete(provider.name)}
                                    className="absolute top-3 right-3 opacity-0 text-muted-foreground transition-opacity group-hover:opacity-100 hover:text-destructive"
                                >
                                    <Trash2 />
                                </Button>

                                {/* Konten — row: avatar kiri, teks & chips kanan */}
                                <div className="flex min-w-0 flex-row items-start gap-3">
                                    {/* Avatar bulat berglow — focal point */}
                                    <div className="flex size-12 shrink-0 h-full items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary shadow-[0_0_15px] shadow-primary/15">
                                        <Globe className="size-6" />
                                    </div>

                                    {/* Info — min-w-0 biar truncate jalan */}
                                    <div className="flex min-w-0 flex-col gap-1.5">
                                        <h3 className="truncate text-sm font-semibold text-foreground my-2">
                                            {provider.name}
                                        </h3>

                                        {/* Metadata — font mono, chip */}
                                        <div className="flex flex-wrap gap-1.5">
                                            <Badge size="sm" className="font-mono max-w-full">
                                                <span className="text-muted-foreground">URL:</span>
                                                <span className="truncate">{provider.url.startsWith("http://") ? provider.url.slice(7) : provider.url.slice(8)}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted/50">
                            <Globe className="size-8 text-muted-foreground/60" />
                        </div>
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
