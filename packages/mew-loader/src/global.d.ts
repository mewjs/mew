declare module 'resolve-glob' {
    function glob(matchers: string[], callback: (error: any, files: string[]) => void): void;
    function sync(matchers: string[]): string[];

    // export default glob;
    // declare namespace glob {
    //     sync;
    // }
}
