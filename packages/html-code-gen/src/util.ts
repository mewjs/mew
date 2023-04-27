
// 'a${x}c', {x:'b'} -> 'abc'
export function format(template: string, vars: { [key: string]: any }): string {
    return template.replace(/\$\{([^{}]*)\}/g, (_, name) => {
        const value = vars[name.trim()];
        return value == null ? '' : String(value);
    });
}


// generate indent content
export function indent(level: number, type: 'tab'): string;
export function indent(level: number, type: 'space', size?: number): string;
export function indent(level: number, type: 'tab' | 'space', size = 4) {
    return (type === 'tab' ? '\t' : ' '.repeat(Math.max(size, 0))).repeat(Math.max(level, 0));
}

// is in an array
export function isIn<T>(source: T, target: T[]) {
    return target.includes(source);
}
