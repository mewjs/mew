/**
 * @file babel-eslint-plugin 中的测试禁用测试
 */

class MyClass {

    hello() {
        this.hello();
    }
}
// eslint-disable-next-line babel/new-cap
export const myClass = MyClass();
// eslint-disable-next-line babel/camelcase
myClass.no_camelcased = 1;
// eslint-disable-next-line babel/quotes
myClass.a = typeof foo === "object";

export default MyClass;
