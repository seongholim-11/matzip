/**
 * 콘솔에 로그를 남기기 위한 전용 클래스입니다.
 * 나중에 로그 서버에 데이터를 보내는 등 기능을 확장하기 좋습니다.
 */
class Logger {
  /** 디버그용 정보 (개발 중에만 확인용) */
  debug(message: string, ...args: unknown[]): void {
    console.log(`[DEBUG]`, message, ...args)
  }

  /** 일반적인 정보성 로그 */
  info(message: string, ...args: unknown[]): void {
    console.log(`[INFO]`, message, ...args)
  }

  /** 경고성 로그 (문제가 생길 수도 있을 때) */
  warn(message: string, ...args: unknown[]): void {
    console.log(`[WARN]`, message, ...args)
  }

  /** 에러 로그 (실제로 에러가 발생했을 때) */
  error(message: string | Error, ...args: unknown[]): void {
    console.log(`[ERROR]`, message, ...args)
  }
}

// 로그를 쉽게 남길 수 있도록 인스턴스를 하나 만들어 내보냅니다.
export const logger = new Logger()
