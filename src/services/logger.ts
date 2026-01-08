class Logger {
  debug(message: string, ...args: unknown[]): void {
    console.log(`[DEBUG]`, message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    console.log(`[INFO]`, message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    console.log(`[WARN]`, message, ...args)
  }

  error(message: string | Error, ...args: unknown[]): void {
    console.log(`[ERROR]`, message, ...args)
  }
}

export const logger = new Logger()
