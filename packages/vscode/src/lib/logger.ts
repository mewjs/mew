interface Logger {
    log(...content: any): void;
    error(...content: any): void;
}


let instance: Logger = console;

const logger = {
    bindTo(loggerInstance: Logger) {
        instance = loggerInstance;
    },
    log(...args: any[]) {
        instance.log(...args);
    },
    error(...args: any[]) {
        instance.log(...args);
    }
};

export default logger;
