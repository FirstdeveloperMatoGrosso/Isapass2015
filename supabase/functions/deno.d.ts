/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;

  export interface ListenOptions {
    port: number;
    hostname?: string;
    transport?: 'tcp';
  }

  export interface Listener {
    accept(): Promise<Conn>;
    close(): void;
    readonly addr: Addr;
  }

  export interface Conn {
    readonly rid: number;
    close(): void;
    readonly localAddr: Addr;
    readonly remoteAddr: Addr;
    read(p: Uint8Array): Promise<number | null>;
    write(p: Uint8Array): Promise<number>;
  }

  export interface Addr {
    transport: 'tcp' | 'udp';
    hostname: string;
    port: number;
  }

  export function listen(options: ListenOptions): Listener;
}

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export interface ServeInit {
    port?: number;
    hostname?: string;
    handler?: (request: Request) => Response | Promise<Response>;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export type Handler = (request: Request) => Response | Promise<Response>;

  export function serve(handler: Handler, options?: ServeInit): Promise<void>;
  export function serve(options: ServeInit): Promise<void>;
}
