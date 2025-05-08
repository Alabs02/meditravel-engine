const chalk = require("chalk");

type LogLevel = "info" | "warn" | "error" | "debug" | "success";

class Logger {
  private static instance: Logger;
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(message: any): string {
    if (typeof message === "object") {
      return JSON.stringify(message, null, 2);
    }
    return String(message);
  }

  private logWithLevel(level: LogLevel, ...messages: any[]): void {
    if (!this.isEnabled) return;

    const timestamp = chalk.gray(`[${this.timestamp()}]`);
    let levelTag: string;

    switch (level) {
      case "info":
        levelTag = chalk.blue(`[INFO]`);
        break;
      case "warn":
        levelTag = chalk.yellow(`[WARNING]`);
        break;
      case "error":
        levelTag = chalk.red(`[ERROR]`);
        break;
      case "debug":
        levelTag = chalk.magenta(`[DEBUG]`);
        break;
      case "success":
        levelTag = chalk.green(`[SUCCESS]`);
        break;
      default:
        levelTag = chalk.white(`[LOG]`);
    }

    const formattedMessages = messages
      .map((msg) => this.formatMessage(msg))
      .join(" ");
    console.log(`${timestamp} ${levelTag} ${formattedMessages}`);
  }

  public log(...messages: any[]): void {
    this.logWithLevel("info", ...messages);
  }

  public info(...messages: any[]): void {
    this.logWithLevel("info", ...messages);
  }

  public warn(...messages: any[]): void {
    this.logWithLevel("warn", ...messages);
  }

  public error(...messages: any[]): void {
    this.logWithLevel("error", ...messages);
  }

  public debug(...messages: any[]): void {
    this.logWithLevel("debug", ...messages);
  }

  public success(...messages: any[]): void {
    this.logWithLevel("success", ...messages);
  }

  public red(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.red(...messages.map(this.formatMessage)));
  }

  public green(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.green(...messages.map(this.formatMessage)));
  }

  public yellow(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.yellow(...messages.map(this.formatMessage)));
  }

  public blue(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.blue(...messages.map(this.formatMessage)));
  }

  public magenta(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.magenta(...messages.map(this.formatMessage)));
  }

  public cyan(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.cyan(...messages.map(this.formatMessage)));
  }

  public gray(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.gray(...messages.map(this.formatMessage)));
  }

  public white(...messages: any[]): void {
    if (!this.isEnabled) return;
    console.log(chalk.white(...messages.map(this.formatMessage)));
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }
}

const loggerInstance = Logger.getInstance();
global.log = loggerInstance;
module.exports = loggerInstance;
