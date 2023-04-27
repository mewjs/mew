export type VisitorKeys = Readonly<{
    [type: string]: readonly string[] | undefined;
}>

declare const evk: {
    KEYS: VisitorKeys;
    getKeys(node: { type: string }): readonly string[];
    unionWith(keys: VisitorKeys): VisitorKeys;
};
export default evk;
