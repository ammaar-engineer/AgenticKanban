import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoisted mocks (available before vi.mock factories run) ─────────
const { mockSave, mockCreate, mockFind, mockDelete } = vi.hoisted(() => ({
  mockSave: vi.fn(),
  mockCreate: vi.fn(),
  mockFind: vi.fn(),
  mockDelete: vi.fn(),
}));

// ── Mocks ──────────────────────────────────────────────────────────
vi.mock("../src/index.js", () => ({
  AppDataSource: {
    getRepository: () => ({
      save: mockSave,
      create: mockCreate,
      find: mockFind,
      delete: mockDelete,
    }),
  },
}));

// TypeOrmHandle just calls the action directly (no DB layer in tests)
vi.mock("../src/utils/typeorm.wrapper.js", () => ({
  TypeOrmHandle: async (action: () => Promise<void>) => {
    await action();
  },
}));

// ── Import controller after mocks are wired ────────────────────────
import { agents } from "../src/routes/agents/controllers.js";

// ── Helper ─────────────────────────────────────────────────────────
function uuid() {
  return "550e8400-e29b-41d4-a716-446655440000";
}

// ── Tests ──────────────────────────────────────────────────────────
describe("POST /agents/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates agent with valid data", async () => {
    const payload = {
      name: "Test Agent",
      model_id: "gpt-4o",
      personality: "Helpful",
      description: "A test agent",
      provider_id: uuid(),
    };

    const fakeAgent = { id: 1, ...payload };
    mockCreate.mockReturnValue(fakeAgent);
    mockSave.mockResolvedValue(fakeAgent);

    const res = await agents.request("/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Agent has been created");
    expect(mockCreate).toHaveBeenCalledWith(payload);
    expect(mockSave).toHaveBeenCalledOnce();
  });

  it("creates agent with optional fields omitted", async () => {
    const payload = {
      name: "Minimal Agent",
      model_id: "claude-3",
      provider_id: uuid(),
    };

    mockCreate.mockReturnValue({ id: 2, ...payload });
    mockSave.mockResolvedValue(undefined);

    const res = await agents.request("/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Minimal Agent",
      model_id: "claude-3",
      personality: undefined,
      description: undefined,
      provider_id: uuid(),
    });
  });

  it("rejects invalid provider_id (not UUID)", async () => {
    const payload = {
      name: "Bad Agent",
      model_id: "gpt-4o",
      provider_id: "not-a-uuid",
    };

    const res = await agents.request("/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    expect(res.status).toBe(400);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const res = await agents.request("/create", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Only Name" }).toString(),
    });

    expect(res.status).toBe(400);
    expect(mockSave).not.toHaveBeenCalled();
  });
});

describe("GET /agents/list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns agent list with provider relation", async () => {
    const agentsList = [
      {
        id: 1,
        name: "Agent A",
        model_id: "gpt-4o",
        personality: null,
        description: null,
        provider: { name: "OpenAI" },
      },
      {
        id: 2,
        name: "Agent B",
        model_id: "claude-3",
        personality: "Witty",
        description: "Test desc",
        provider: { name: "Anthropic" },
      },
    ];

    mockFind.mockResolvedValue(agentsList);

    const res = await agents.request("/list", { method: "GET" });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Success");
    expect(body.data).toEqual(agentsList);
    expect(body.data).toHaveLength(2);

    // Verify query includes relation loading
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({
        relations: { provider: true },
      }),
    );
  });

  it("returns empty list", async () => {
    mockFind.mockResolvedValue([]);

    const res = await agents.request("/list", { method: "GET" });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
  });
});

describe("DELETE /agents/delete/:agentId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes agent by id", async () => {
    mockDelete.mockResolvedValue({ affected: 1 });

    const res = await agents.request("/delete/42", { method: "DELETE" });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Data has been deleted");
    expect(mockDelete).toHaveBeenCalledWith({ id: 42 });
  });

  it("passes numeric id correctly (not string)", async () => {
    mockDelete.mockResolvedValue({ affected: 0 });

    await agents.request("/delete/100", { method: "DELETE" });

    expect(mockDelete).toHaveBeenCalledWith({ id: 100 });
    expect(typeof mockDelete.mock.calls[0][0].id).toBe("number");
  });
});
