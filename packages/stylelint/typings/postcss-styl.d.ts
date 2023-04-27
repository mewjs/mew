import postcss from 'postcss';

declare module 'postcss-styl' {
    interface Raws extends postcss.NodeRaws {
        stylusBetween: string;
    }

    export interface Node extends postcss.Node {
        prop: string;
        raws: Raws;
        omittedSemi?: boolean;
    }
}
