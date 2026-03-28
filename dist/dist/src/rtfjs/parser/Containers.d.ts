import { Renderer } from "../renderer/Renderer";
import { IDestination } from "./destinations/DestinationBase";
export declare type TableBorderSide = "top" | "left" | "bottom" | "right";
export interface ITableBorder {
    style?: string;
    width?: number;
    colorindex?: number;
}
export interface ITableCell {
    left: number;
    right: number;
    mergeStart?: boolean;
    mergeContinue?: boolean;
    vMergeStart?: boolean;
    vMergeContinue?: boolean;
    borders: {
        [key in TableBorderSide]?: ITableBorder;
    };
}
export interface ITableRow {
    left: number;
    cells: ITableCell[];
}
export declare class Chp {
    bold: boolean;
    underline: string;
    italic: boolean;
    strikethrough: boolean;
    dblstrikethrough: boolean;
    colorindex: number;
    highlightindex: number;
    fontsize: number;
    fontfamily: number;
    supersubscript: number;
    constructor(parent: Chp);
}
export declare class Tbl {
    intbl: boolean;
    rows: ITableRow[];
    currentRow: ITableRow;
    currentCell: ITableCell;
    activeBorderSide: TableBorderSide;
    [key: string]: any;
    constructor(parent?: Tbl);
    hasOpenRow(): boolean;
    startRow(): void;
    finalizeRow(): void;
    setRowLeft(left: number): void;
    setCellRight(right: number): void;
    setMergeStart(): void;
    setMergeContinue(): void;
    setVerticalMergeStart(): void;
    setVerticalMergeContinue(): void;
    beginBorder(side: TableBorderSide): void;
    setBorderStyle(style: string): void;
    setBorderWidth(width: number): void;
    setBorderColorIndex(colorindex: number): void;
    private _ensureRow;
    private _ensureCell;
    private _getActiveBorder;
    private _createCell;
}
export declare class Pap {
    indent: {
        left: number;
        right: number;
        firstline: number;
    };
    justification: string;
    spacebefore: number;
    spaceafter: number;
    charactertype: string | null;
    intable: boolean;
    isrow: boolean;
    constructor(parent: Pap);
}
export declare class Sep {
    columns: number;
    breaktype: string;
    pagenumber: {
        x: number;
        y: number;
    };
    pagenumberformat: string;
    constructor(parent: Sep);
}
export declare class Dop {
    width: number;
    height: number;
    margin: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    pagenumberstart: number;
    facingpages: boolean;
    landscape: boolean;
    constructor(parent: Dop);
}
export declare class State {
    parent: State;
    first: boolean;
    skipchars: number;
    bindata: number;
    chp: Chp;
    pap: Pap;
    sep: Sep;
    dop: Dop;
    table: Tbl;
    destination: IDestination;
    skipunknowndestination: boolean;
    skipdestination: boolean;
    ucn: number;
    [key: string]: any;
    constructor(parent: State);
}
export declare class GlobalState {
    data: Uint8Array;
    pos: number;
    line: number;
    column: number;
    state: State;
    version: number;
    text: (PlainText | HexText)[];
    codepage: number;
    _asyncTasks: Promise<any>[];
    renderer: Renderer;
    constructor(blob: ArrayBuffer, renderer: Renderer);
}
export declare class PlainText {
    text: string;
    constructor(text: string);
}
export declare class HexText {
    hex: number;
    chp: Chp;
    constructor(hex: number, chp: Chp);
}
