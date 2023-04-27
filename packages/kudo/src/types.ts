
export interface File {
    pid: string;
    cid: string;
    path: string;
    relative: string;
    contents: string;
    stat?: {
        size: number;
        total: number;
    };
    filter?: {
        lines: string;
        level: number;
    };
    isNull: () => false;
}


export interface Diff {
    // 变化的行数
    lines: number;
    // 变化的范围
    range: number[];
    // 是否新文件
    isNew: boolean;
}
