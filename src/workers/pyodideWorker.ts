// src/workers/pyodideWorker.ts
/// <reference lib="webworker" />

export interface WorkerInitMessage {
  id: string;
  type: "INIT";
}

export interface WorkerRunMessage {
  id: string;
  type: "RUN";
  code: string;
}

export type WorkerInboundMessage = WorkerInitMessage | WorkerRunMessage;

export interface WorkerStatusMessage {
  type: "STATUS";
  status: "loading_runtime" | "loading_packages" | "ready" | "running" | "error";
  message: string;
}

export interface WorkerInitDoneMessage {
  id: string;
  type: "INIT_DONE";
  success: boolean;
  error?: string;
}

export interface WorkerRunResultMessage {
  id: string;
  type: "RUN_RESULT";
  success: boolean;
  stdout: string;
  stderr: string;
  figures: string[];
  error: string | null;
  executionTimeMs: number;
}

export type WorkerOutboundMessage =
  | WorkerStatusMessage
  | WorkerInitDoneMessage
  | WorkerRunResultMessage;

interface PyodideInterface {
  loadPackage: (packages: string | string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (name: string, value: unknown) => void;
    get: (name: string) => unknown;
  };
}

let pyodide: PyodideInterface | null = null;
let initPromise: Promise<PyodideInterface> | null = null;

function postMsg(msg: WorkerOutboundMessage) {
  self.postMessage(msg);
}

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodide) return pyodide;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    postMsg({
      type: "STATUS",
      status: "loading_runtime",
      message: "Loading Python WebAssembly runtime...",
    });

    // In modern ES module workers, loadPyodide is dynamically imported from Pyodide's official ES module CDN
    const importRemoteModule = new Function("url", "return import(url)");
    const { loadPyodide } = (await importRemoteModule(
      "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs"
    )) as { loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface> };

    const instance: PyodideInterface = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });

    postMsg({
      type: "STATUS",
      status: "loading_packages",
      message: "Loading scientific packages (NumPy, Matplotlib)...",
    });

    await instance.loadPackage(["numpy", "matplotlib"]);

    // Initialize environment & override plt.show so figures stay open for capture
    await instance.runPythonAsync(`
import sys
import io
import base64

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    # Robust Pyodide WebAssembly matplotlib & font settings
    matplotlib.rcParams['font.family'] = 'sans-serif'
    matplotlib.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Bitstream Vera Sans', 'sans-serif']
    matplotlib.rcParams['mathtext.fontset'] = 'dejavusans'
    matplotlib.rcParams['mathtext.default'] = 'regular'
    matplotlib.rcParams['text.usetex'] = False
    matplotlib.rcParams['figure.autolayout'] = False

    # Patch matplotlib._mathtext symbol maps to handle common TeX shorthand aliases like \\le and \\ge
    try:
        import matplotlib._mathtext as _mt
        if hasattr(_mt, 'tex2uni'):
            if 'leq' in _mt.tex2uni and 'le' not in _mt.tex2uni:
                _mt.tex2uni['le'] = _mt.tex2uni['leq']
            if 'geq' in _mt.tex2uni and 'ge' not in _mt.tex2uni:
                _mt.tex2uni['ge'] = _mt.tex2uni['geq']
            if 'neq' in _mt.tex2uni and 'ne' not in _mt.tex2uni:
                _mt.tex2uni['ne'] = _mt.tex2uni['neq']
        if hasattr(_mt, 'latex_to_bakoma'):
            if r'\leq' in _mt.latex_to_bakoma and r'\le' not in _mt.latex_to_bakoma:
                _mt.latex_to_bakoma[r'\le'] = _mt.latex_to_bakoma[r'\leq']
            if r'\geq' in _mt.latex_to_bakoma and r'\ge' not in _mt.latex_to_bakoma:
                _mt.latex_to_bakoma[r'\ge'] = _mt.latex_to_bakoma[r'\geq']
            if r'\neq' in _mt.latex_to_bakoma and r'\ne' not in _mt.latex_to_bakoma:
                _mt.latex_to_bakoma[r'\ne'] = _mt.latex_to_bakoma[r'\neq']
    except Exception:
        pass

    # Pre-render a tiny dummy plot to initialize FreeType font cache in the worker
    _fig, _ax = plt.subplots(figsize=(2, 2))
    _ax.plot([0, 1], [0, 1])
    _ax.set_title("Weber Engine")
    _buf = io.BytesIO()
    _fig.savefig(_buf, format='png', dpi=80)
    plt.close('all')

    # Monkeypatch plt.show to be a no-op so figures remain open until we save them
    plt.show = lambda *args, **kwargs: None
except Exception:
    pass
`);

    postMsg({
      type: "STATUS",
      status: "ready",
      message: "Python runtime ready",
    });

    pyodide = instance;
    return instance;
  })();

  return initPromise;
}

self.onmessage = async (e: MessageEvent<WorkerInboundMessage>) => {
  const data = e.data || {};
  const { id, type } = data;

  if (type === "INIT") {
    try {
      await getPyodide();
      postMsg({ id, type: "INIT_DONE", success: true });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : String(err) || "Failed to initialize Pyodide";
      postMsg({ id, type: "INIT_DONE", success: false, error: errorMsg });
    }
    return;
  }

  if (type === "RUN") {
    const rawCode = (data as WorkerRunMessage).code || "";
    // Pre-sanitize common LaTeX aliases that trip up Matplotlib's mathtext parser
    const code = rawCode
      .replace(/\\le(?=[^a-zA-Z]|$)/g, "\\leq")
      .replace(/\\ge(?=[^a-zA-Z]|$)/g, "\\geq")
      .replace(/\\to(?=[^a-zA-Z]|$)/g, "\\rightarrow")
      .replace(/\\ne(?=[^a-zA-Z]|$)/g, "\\neq");

    const startTime = performance.now();
    try {
      const p = await getPyodide();

      p.globals.set("__USER_CODE_PAYLOAD__", code);

      const runnerScript = `
import sys, io, base64, json

_stdout_buf = io.StringIO()
_stderr_buf = io.StringIO()
_orig_stdout, _orig_stderr = sys.stdout, sys.stderr
sys.stdout, sys.stderr = _stdout_buf, _stderr_buf

_figures = []
_error_msg = None

try:
    import matplotlib
    import matplotlib.pyplot as plt
    plt.close('all')
    matplotlib.rcParams['mathtext.fontset'] = 'dejavusans'
    matplotlib.rcParams['text.usetex'] = False

    # Ensure symbol aliases are registered in the current runner process
    import matplotlib._mathtext as _mt
    if hasattr(_mt, 'tex2uni'):
        if 'leq' in _mt.tex2uni and 'le' not in _mt.tex2uni:
            _mt.tex2uni['le'] = _mt.tex2uni['leq']
        if 'geq' in _mt.tex2uni and 'ge' not in _mt.tex2uni:
            _mt.tex2uni['ge'] = _mt.tex2uni['geq']
        if 'neq' in _mt.tex2uni and 'ne' not in _mt.tex2uni:
            _mt.tex2uni['ne'] = _mt.tex2uni['neq']
    if hasattr(_mt, 'latex_to_bakoma'):
        if r'\leq' in _mt.latex_to_bakoma and r'\le' not in _mt.latex_to_bakoma:
            _mt.latex_to_bakoma[r'\le'] = _mt.latex_to_bakoma[r'\leq']
        if r'\geq' in _mt.latex_to_bakoma and r'\ge' not in _mt.latex_to_bakoma:
            _mt.latex_to_bakoma[r'\ge'] = _mt.latex_to_bakoma[r'\geq']
        if r'\neq' in _mt.latex_to_bakoma and r'\ne' not in _mt.latex_to_bakoma:
            _mt.latex_to_bakoma[r'\ne'] = _mt.latex_to_bakoma[r'\neq']
except Exception:
    pass

try:
    _exec_globals = {"__name__": "__main__"}
    exec(__USER_CODE_PAYLOAD__, _exec_globals)
except Exception as _exec_e:
    import traceback
    traceback.print_exc(file=_stderr_buf)
    _error_msg = str(_exec_e)
finally:
    try:
        import matplotlib.pyplot as plt
        fignums = plt.get_fignums()
        if not fignums:
            try:
                _curr = plt.gcf()
                if _curr and _curr.axes:
                    fignums = [_curr.number]
            except Exception:
                pass

        for fignum in fignums:
            fig = plt.figure(fignum)
            buf = io.BytesIO()
            # Try tight bbox first, gracefully fallback to standard bounding box if mathtext error occurs
            try:
                fig.savefig(buf, format='png', bbox_inches='tight', dpi=140, facecolor=fig.get_facecolor(), edgecolor='none')
            except Exception:
                buf.seek(0)
                buf.truncate(0)
                try:
                    fig.savefig(buf, format='png', dpi=130, facecolor=fig.get_facecolor(), edgecolor='none')
                except Exception:
                    # Last resort fallback: if mathtext parser fails in titles/legends, strip math syntax
                    try:
                        buf.seek(0)
                        buf.truncate(0)
                        for ax in fig.get_axes():
                            leg = ax.get_legend()
                            if leg:
                                for t in leg.get_texts():
                                    t.set_text(t.get_text().replace('$', ''))
                            title = ax.get_title()
                            if '$' in title:
                                ax.set_title(title.replace('$', ''))
                        fig.savefig(buf, format='png', dpi=120, facecolor=fig.get_facecolor(), edgecolor='none')
                    except Exception:
                        pass
            buf.seek(0)
            data = buf.read()
            if len(data) > 0:
                _figures.append(base64.b64encode(data).decode('utf-8'))
        plt.close('all')
    except Exception:
        import traceback
        traceback.print_exc(file=_stderr_buf)

    sys.stdout, sys.stderr = _orig_stdout, _orig_stderr

json.dumps({
    "stdout": _stdout_buf.getvalue(),
    "stderr": _stderr_buf.getvalue(),
    "figures": _figures,
    "error": _error_msg
})
`;

      const rawResult = await p.runPythonAsync(runnerScript);
      const parsed = JSON.parse(String(rawResult ?? "{}"));
      const executionTimeMs = Math.round(performance.now() - startTime);

      postMsg({
        id,
        type: "RUN_RESULT",
        success: !parsed.error,
        stdout: parsed.stdout || "",
        stderr: parsed.stderr || "",
        figures: parsed.figures || [],
        error: parsed.error || null,
        executionTimeMs,
      });
    } catch (err: unknown) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      const errorMsg =
        err instanceof Error ? err.message : String(err) || "Runtime execution error";
      postMsg({
        id,
        type: "RUN_RESULT",
        success: false,
        stdout: "",
        stderr: errorMsg,
        figures: [],
        error: errorMsg,
        executionTimeMs,
      });
    }
  }
};
