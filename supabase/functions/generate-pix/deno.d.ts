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
