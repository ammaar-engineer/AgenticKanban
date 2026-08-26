import { useState } from "react"

import { FormDialogShell, type FormField } from "./form.dialog.shell"

// ─── Contoh 1: Create Board (pakai state object { data, setData }) ───────────
type BoardForm = { name: string; description: string }

export function BoardCreateDialog() {
  const [open, setOpen] = useState(false)
  // Parent pegang state-nya sendiri, terus di-props-drill satu object doang:
  const [state, setState] = useState<BoardForm>({ name: "", description: "" })

  const fields: FormField[] = [
    { name: "name", label: "Nama Board", type: "text", placeholder: "Misal: Content pipeline", required: true },
    { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Buat apa board ini..." },
  ]

  const onSubmit = (data: BoardForm) => {
    console.log("Board baru:", data)
    // simpan ke server / state parent
    setOpen(false) // tutup manual — parent yang decide
  }

  return (
    <FormDialogShell<BoardForm>
      open={open}
      onOpenChange={setOpen}
      title="Create Board"
      description="Bikin kanban board baru buat tim kamu."
      state={{ data: state, setData: setState }}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Simpan Board"
    />
  )
}

// ─── Contoh 2: Select field (misal milih provider buat agent) ────────────────
type AgentForm = { name: string; model_id: string; provider_id: string }

export function AgentCreateDialog() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<AgentForm>({
    name: "",
    model_id: "",
    provider_id: "",
  })

  const fields: FormField[] = [
    { name: "name", label: "Nama Agent", type: "text", required: true },
    { name: "model_id", label: "Model ID", type: "text", placeholder: "claude-sonnet-5", required: true },
    {
      name: "provider_id",
      label: "Provider",
      type: "select",
      options: [
        { label: "Anthropic", value: "1" },
        { label: "OpenAI", value: "2" },
        { label: "DeepSeek", value: "3" },
      ],
      required: true,
    },
  ]

  return (
    <FormDialogShell<AgentForm>
      open={open}
      onOpenChange={setOpen}
      title="Create Agent"
      state={{ data: state, setData: setState }}
      fields={fields}
      onSubmit={d => {
        console.log("Agent baru:", d)
        setOpen(false)
      }}
    />
  )
}

// ─── Gimana cara membukanya dari parent ──────────────────────────────────────
// Parent cukup:
//   const [open, setOpen] = useState(false)
//   <Button onClick={() => setOpen(true)}><Plus /> Create</Button>
//   <BoardCreateDialog />   // di dalamnya render FormDialogShell
//
// Props cuma: open, onOpenChange, title, state, fields, onSubmit.
// Gak ada props drilling tambahan — state object single entry point.
