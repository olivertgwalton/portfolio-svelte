/* tslint:disable */
/* eslint-disable */

export class BenchmarkEngine {
    free(): void;
    [Symbol.dispose](): void;
    count(): number;
    init(width: number, height: number): void;
    constructor(count: number);
    pos_x_ptr(): number;
    pos_y_ptr(): number;
    render(): number;
    update(time: number, width: number, height: number): void;
}

export class GridEngine {
    free(): void;
    [Symbol.dispose](): void;
    count(): number;
    init(width: number, height: number, spacing: number, dpr: number): void;
    constructor(count: number);
    pos_x_ptr(): number;
    pos_y_ptr(): number;
    update(mouse_x: number, mouse_y: number, dpr: number, stiffness: number, friction: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_benchmarkengine_free: (a: number, b: number) => void;
    readonly __wbg_gridengine_free: (a: number, b: number) => void;
    readonly benchmarkengine_count: (a: number) => number;
    readonly benchmarkengine_init: (a: number, b: number, c: number) => void;
    readonly benchmarkengine_new: (a: number) => number;
    readonly benchmarkengine_pos_x_ptr: (a: number) => number;
    readonly benchmarkengine_pos_y_ptr: (a: number) => number;
    readonly benchmarkengine_render: (a: number) => number;
    readonly benchmarkengine_update: (a: number, b: number, c: number, d: number) => void;
    readonly gridengine_count: (a: number) => number;
    readonly gridengine_init: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly gridengine_new: (a: number) => number;
    readonly gridengine_update: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly gridengine_pos_x_ptr: (a: number) => number;
    readonly gridengine_pos_y_ptr: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
