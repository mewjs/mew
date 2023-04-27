export default class A<T> {
    private list: T[] = [];

    constructor(private name = 'a', t: T) {
        this.list.push(t);
    }

    getName(): string {
        return  this.name;
    }

    pop(): T | undefined {
        return this.list.pop();
    }
}
