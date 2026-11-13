// src/lib/pythonRunner.ts
"use client";

export interface PythonResult {
  stdout: string;
  stderr: string;
  figures: string[]; // Data URLs (data:image/png;base64,...)
  executionTimeMs: number;
  error?: string | null;
}

export type PythonStatusState =
  | "idle"
  | "loading_runtime"
  | "loading_packages"
  | "ready"
  | "running"
  | "error";

export interface PythonRuntimeStatus {
  state: PythonStatusState;
  message?: string;
}

type StatusListener = (status: PythonRuntimeStatus) => void;

class PythonRunnerService {
  private worker: Worker | null = null;
  private currentStatus: PythonRuntimeStatus = { state: "idle" };
  private statusListeners = new Set<StatusListener>();
  private requestMap = new Map<
    string,
    {
      resolve: (res: PythonResult) => void;
      reject: (err: unknown) => void;
      timeoutTimer: ReturnType<typeof setTimeout>;
    }
  >();
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private setStatus(state: PythonStatusState, message?: string) {
    this.currentStatus = { state, message };
    this.statusListeners.forEach((fn) => {
      try {
        fn(this.currentStatus);
      } catch {}
    });
  }

  public getStatus(): PythonRuntimeStatus {
    return this.currentStatus;
  }

  private getWorker(): Worker {
    if (this.worker) return this.worker;

    if (typeof window === "undefined") {
      throw new Error("Python runner only operates in browser environment.");
    }

    const worker = new Worker(
      new URL("../workers/pyodideWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (e: MessageEvent) => {
      const data = e.data || {};
      const { id, type, status, message, stdout, stderr, figures, error, executionTimeMs } = data;

      if (type === "STATUS") {
        this.setStatus(status, message);
        return;
      }

      if (type === "INIT_DONE") {
        if (data.success) {
          this.setStatus("ready", "Python runtime ready");
        } else {
          this.setStatus("error", error || "Failed to initialize runtime");
        }
        return;
      }

      if (type === "RUN_RESULT" && id) {
        const handler = this.requestMap.get(id);
        if (handler) {
          clearTimeout(handler.timeoutTimer);
          this.requestMap.delete(id);

          const formattedFigures = (figures || []).map((b64: string) =>
            b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`
          );

          handler.resolve({
            stdout: stdout || "",
            stderr: stderr || "",
            figures: formattedFigures,
            executionTimeMs: executionTimeMs || 0,
            error: error || null,
          });

          this.setStatus("ready", "Ready");
        }
      }
    };

    worker.onerror = (err) => {
      console.error("[PythonRunner] Worker error:", err);
      this.setStatus("error", "Web Worker runtime error");
    };

    this.worker = worker;
    return worker;
  }

  public async preload(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    if (typeof window === "undefined") return;

    this.initPromise = new Promise<void>((resolve, reject) => {
      try {
        const w = this.getWorker();
        const id = `init-${Date.now()}`;
        const handleInit = (e: MessageEvent) => {
          if (e.data?.type === "INIT_DONE") {
            w.removeEventListener("message", handleInit);
            if (e.data.success) {
              resolve();
            } else {
              reject(new Error(e.data.error || "Initialization failed"));
            }
          }
        };
        w.addEventListener("message", handleInit);
        w.postMessage({ id, type: "INIT" });
      } catch (err) {
        reject(err);
      }
    });

    return this.initPromise;
  }

  public async runCode(code: string, timeoutMs: number = 25000): Promise<PythonResult> {
    if (typeof window === "undefined") {
      throw new Error("Cannot execute Python on server");
    }

    const worker = this.getWorker();
    const id = `req-${Math.random().toString(36).slice(2, 9)}`;

    this.setStatus("running", "Executing Python script...");

    return new Promise<PythonResult>((resolve, reject) => {
      const timeoutTimer = setTimeout(() => {
        this.requestMap.delete(id);
        // If timed out, terminate hung worker and recreate
        try {
          this.worker?.terminate();
        } catch {}
        this.worker = null;
        this.setStatus("error", "Execution timed out");
        resolve({
          stdout: "",
          stderr: "Execution timed out (exceeded limit of 25 seconds).",
          figures: [],
          executionTimeMs: timeoutMs,
          error: "Execution timed out",
        });
      }, timeoutMs);

      this.requestMap.set(id, { resolve, reject, timeoutTimer });
      worker.postMessage({ id, type: "RUN", code });
    });
  }
}

export const pythonRunner = new PythonRunnerService();
