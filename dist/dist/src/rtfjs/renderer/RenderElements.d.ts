/// <reference types="jquery" />
import { Document } from "../Document";
import { Chp, ITableCell, ITableRow, Pap, Tbl } from "../parser/Containers";
export declare class RenderElement {
    _doc: Document;
    _type: string;
    _element: JQuery;
    _pap: Pap;
    _chp: Chp;
    constructor(doc: Document, type: string, element: JQuery | HTMLElement);
    getElement(): JQuery<HTMLElement>;
    getContent(): JQuery<HTMLElement>;
    updateProps(pap: Pap, chp: Chp): void;
    finalize(): JQuery<HTMLElement>;
}
export declare class RenderTextElement extends RenderElement {
    constructor(doc: Document, text: string, chp: Chp);
    applyProps(): void;
    finalize(): JQuery<HTMLElement>;
}
export interface ISub {
    container: RenderElement;
    pap?: Pap;
    chp?: Chp;
}
export declare class RenderContainer extends RenderElement {
    _content: JQuery;
    _sub: ISub[];
    constructor(doc: Document, type: string, element: JQuery | HTMLElement, content: JQuery | HTMLElement);
    getType(): string;
    getContent(): JQuery<HTMLElement>;
    appendSub(container: RenderContainer): void;
    _finalizeSub(sub: ISub, parentPap: Pap): JQuery<HTMLElement>;
    finalize(): JQuery<HTMLElement>;
}
export declare class RenderParagraphContainer extends RenderContainer {
    constructor(doc: Document);
    appendSub(container: RenderElement): void;
    updateProps(pap: Pap, chp: Chp): void;
    applyPap(el: JQuery, pap: Pap, chp: Chp): void;
    _finalizeSub(sub: ISub, parentPap: Pap): JQuery<HTMLElement>;
    finalize(): JQuery<HTMLElement>;
}
export interface IRow {
    def: ITableRow;
    cells: ICell[];
}
export interface ICell {
    def: ITableCell;
    sub: ISub[];
}
export declare class RenderTableContainer extends RenderContainer {
    _table: Tbl;
    _rows: IRow[];
    _row: IRow;
    _cell: ICell;
    constructor(doc: Document, table: Tbl);
    appendCell(): void;
    appendRow(): void;
    finishRow(): void;
    finishCell(): void;
    private _getColumnBoundaries;
    private _getColumnIndex;
    private _getColSpan;
    private _getRowSpan;
    private _applyBorderStyle;
    private _applyCellStyle;
    finalize(): JQuery<HTMLElement>;
}
