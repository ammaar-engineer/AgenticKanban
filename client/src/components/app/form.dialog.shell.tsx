import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { cn } from "@/lib/utils"

// State object yang di-props-drill dari parent — nilai form + updater.
// Parent pegang state-nya, shell cukup terima satu object ini.
type FormState<T> = {
  data: T
  setData: React.Dispatch<React.SetStateAction<T>>
}

type BaseField = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
}

// Config-driven: parent deklarasiin field lewat array, shell yang render.
type FormField =
  | (BaseField & { type: "text" })
  | (BaseField & { type: "number" })
  | (BaseField & { type: "textarea" })
  | (BaseField & { type: "select"; options: { label: string; value: string }[] })

type FormDialogShellProps<T extends Record<string, unknown>> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  state: FormState<T>
  fields: FormField[]
  onSubmit: (data: T) => void
  submitLabel?: string
  cancelLabel?: string
  className?: string
}

export function FormDialogShell<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  state,
  fields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  className,
}: FormDialogShellProps<T>) {
  const { data, setData } = state
  const baseId = React.useId()

  // Binding inti: satu helper yang nge-update field apapun di state object.
  const update = (name: string, value: unknown) => {
    setData(prev => ({ ...prev, [name]: value }) as T)
  }

  // Selalu baca value sebagai string biar kontrol input/select aman.
  const valueOf = (name: string) =>
    data[name] == null ? "" : String(data[name])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Dialog TIDAK ditutup otomatis — parent yang decide via onOpenChange
    // (biar cocok buat flow submit async / error dari server).
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(field => {
            const id = `${baseId}-${field.name}`

            let control: React.ReactNode
            switch (field.type) {
              case "select":
                control = (
                  <Select
                    value={valueOf(field.name)}
                    onValueChange={value => update(field.name, String(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
                break
              case "textarea":
                control = (
                  <Textarea
                    id={id}
                    placeholder={field.placeholder}
                    value={valueOf(field.name)}
                    onChange={e => update(field.name, e.target.value)}
                  />
                )
                break
              case "number":
                control = (
                  <Input
                    id={id}
                    type="number"
                    placeholder={field.placeholder}
                    value={valueOf(field.name)}
                    onChange={e => {
                      const v = e.target.value
                      update(field.name, v === "" ? "" : Number(v))
                    }}
                  />
                )
                break
              case "text":
              default:
                control = (
                  <Input
                    id={id}
                    type="text"
                    placeholder={field.placeholder}
                    value={valueOf(field.name)}
                    onChange={e => update(field.name, e.target.value)}
                  />
                )
                break
            }

            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                <Label htmlFor={id}>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive"> *</span>
                  )}
                </Label>
                {control}
              </div>
            )
          })}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export type { FormDialogShellProps, FormField, FormState }
