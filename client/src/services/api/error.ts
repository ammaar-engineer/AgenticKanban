// Normalize error ke StandardResponse shape; fallback kalau server tidak kasih shape itu.
export function getApiErrorMessage(err: any): string {
  return err?.response?.data?.message ?? err?.message ?? "Something went wrong";
}
