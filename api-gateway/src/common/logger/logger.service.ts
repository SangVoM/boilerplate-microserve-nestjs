import { Optional, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService implements ILoggerService {
  private static logLevels: LogLevel[] = [
    'log',
    'info',
    'error',
    'warn',
    'debug',
    'verbose',
  ];
  private static lastTimestamp?: number;
  protected static instance?: typeof LoggerService | ILoggerService =
    LoggerService;

  constructor(
    @Optional() protected context?: string,
    @Optional() private readonly isTimestampEnabled = true,
  ) {}

  error(message: any, trace = '', context?: string) {
    const instance = this.getInstance();
    if (!LoggerService.isLogLevelEnabled('error')) {
      return;
    }
    instance &&
      instance.error.call(instance, message, trace, context || this.context);
  }

  log(message: any, context?: string) {
    this.callFunction('log', message, context);
  }

  info(message: any, context?: string) {
    this.callFunction('info', message, context);
  }

  warn(message: any, context?: string) {
    this.callFunction('warn', message, context);
  }

  debug(message: any, context?: string) {
    this.callFunction('debug', message, context);
  }

  verbose(message: any, context?: string) {
    this.callFunction('verbose', message, context);
  }

  setContext(context: string) {
    this.context = context;
  }

  getTimestamp() {
    return LoggerService.getTimestamp();
  }

  static overrideLogger(logger: ILoggerService | LogLevel[] | boolean) {
    if (Array.isArray(logger)) {
      this.logLevels = logger;
      return;
    }
    this.instance =
      typeof logger === 'object' ? (logger as ILoggerService) : undefined;
  }

  static log(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage('info', message, clc.green, context, isTimeDiffEnabled);
  }

  static info(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(
      'info',
      message,
      clc.cyanBright,
      context,
      isTimeDiffEnabled,
    );
  }

  static error(
    message: any,
    trace = '',
    context = '',
    isTimeDiffEnabled = true,
  ) {
    this.printMessage(
      'error',
      message,
      clc.red,
      context,
      isTimeDiffEnabled,
      'stderr',
    );
    this.printStackTrace(trace);
  }

  static warn(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage('warn', message, clc.yellow, context, isTimeDiffEnabled);
  }

  static debug(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(
      'debug',
      message,
      clc.magentaBright,
      context,
      isTimeDiffEnabled,
    );
  }

  static verbose(message: any, context = '', isTimeDiffEnabled = true) {
    this.printMessage(
      'verbose',
      message,
      clc.cyanBright,
      context,
      isTimeDiffEnabled,
    );
  }

  static getTimestamp() {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    };
    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions,
    );
  }

  private callFunction(
    name: 'log' | 'info' | 'warn' | 'debug' | 'verbose',
    message: any,
    context?: string,
  ) {
    if (!LoggerService.isLogLevelEnabled(name)) {
      return;
    }
    const instance = this.getInstance();
    const func = instance && (instance as typeof LoggerService)[name];
    func &&
      func.call(
        instance,
        message,
        context || this.context,
        this.isTimestampEnabled,
      );
  }

  protected getInstance(): typeof LoggerService | ILoggerService {
    const { instance } = LoggerService;
    return instance === this ? LoggerService : instance;
  }

  private static isLogLevelEnabled(level: LogLevel): boolean {
    return LoggerService.logLevels.includes(level);
  }

  private static printMessage(
    level: LogLevel,
    message: any,
    color: (message: string) => string,
    context = '',
    isTimeDiffEnabled?: boolean,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const output = isPlainObject(message)
      ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
      : color(message);
    const levelPip = color(level.toLocaleUpperCase());
    const contextMessage = context ? yellow(`[${context}] `) : '';
    const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
    const instance = (this.instance as typeof LoggerService) ?? LoggerService;
    const timestamp = instance.getTimestamp
      ? instance.getTimestamp()
      : LoggerService.getTimestamp?.();
    const computedMessage = `[${levelPip}][${timestamp}] ${contextMessage}${output}${timestampDiff}\n`;

    process[writeStreamType ?? 'stdout'].write(computedMessage);
  }

  private static updateAndGetTimestampDiff(
    isTimeDiffEnabled?: boolean,
  ): string {
    const includeTimestamp = LoggerService.lastTimestamp && isTimeDiffEnabled;
    const result = includeTimestamp
      ? yellow(` +${Date.now() - LoggerService.lastTimestamp}ms`)
      : '';
    LoggerService.lastTimestamp = Date.now();
    return result;
  }

  private static printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    process.stderr.write(`${trace}\n`);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const isPlainObject = (fn: any): fn is object => {
  if (typeof fn !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
};

type ColorTextFn = (text: string) => string;

const isColorAllowed = () => !process.env.NO_COLOR;
const colorIfAllowed = (colorFn: ColorTextFn) => (text: string) =>
  isColorAllowed() ? colorFn(text) : text;

export const clc = {
  green: colorIfAllowed((text: string) => `\x1B[32m${text}\x1B[39m`),
  yellow: colorIfAllowed((text: string) => `\x1B[33m${text}\x1B[39m`),
  red: colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`),
  magentaBright: colorIfAllowed((text: string) => `\x1B[95m${text}\x1B[39m`),
  cyanBright: colorIfAllowed((text: string) => `\x1B[96m${text}\x1B[39m`),
};
export const yellow = colorIfAllowed(
  (text: string) => `\x1B[38;5;3m${text}\x1B[39m`,
);
export const red = colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`);

declare const process: any;

export type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose';

export interface ILoggerService {
  log(message: any, context?: string);

  info(message: any, context?: string);

  error(message: any, trace?: string, context?: string);

  warn(message: any, context?: string);

  debug?(message: any, context?: string);

  verbose?(message: any, context?: string);
}
