/*

The MIT License (MIT)

Copyright (c) 2015 Thomas Bluemel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import * as $ from "jquery";
import { Document } from "../Document";
import { Helper, RTFJSError } from "../Helper";
import {
    Chp,
    ITableBorder,
    ITableCell,
    ITableRow,
    Pap,
    TableBorderSide,
    Tbl,
} from "../parser/Containers";

function normalizeElement(element: JQuery | HTMLElement): JQuery {
    if (element == null) {
        return null;
    }
    if ((element as JQuery).jquery != null) {
        return element as JQuery;
    }
    return $(element as HTMLElement);
}

export class RenderElement {
    public _doc: Document;
    public _type: string;
    public _element: JQuery;
    public _pap: Pap;
    public _chp: Chp;

    constructor(doc: Document, type: string, element: JQuery | HTMLElement) {
        this._doc = doc;
        this._type = type;
        this._element = normalizeElement(element);
        this._pap = null;
        this._chp = null;
    }

    public getElement() {
        return this._element;
    }

    public getContent() {
        return this._element;
    }

    public updateProps(pap: Pap, chp: Chp) {
        this._pap = pap;
        this._chp = chp;
    }

    public finalize() {
        Helper.log("[rtf] finalizing element of type " + this._type);
        return this._element;
    }
}

export class RenderTextElement extends RenderElement {
    constructor(doc: Document, text: string, chp: Chp) {
        super(doc, "text", $("<span>").text(text));
        this._chp = chp != null ? chp : new Chp(null);
    }

    public applyProps() {
        const chp = this._chp;
        const el = this.getElement();
        Helper.log("[rtf] RenderTextElement: " + el.text());
        Helper.log("[rtf] RenderTextElement applyProps: " + JSON.stringify(chp));
        if (chp.bold) {
            el.css("font-weight", "bold");
        }
        if (chp.italic) {
            el.css("font-style", "italic");
        }
        if (chp.hasOwnProperty("fontfamily") && this._doc._fonts[chp.fontfamily]) {
            const fontFamily = this._doc._fonts[chp.fontfamily].fontname.replace(";", "");
            if (fontFamily !== "Symbol") {
                el.css("font-family", fontFamily);
            }
        }

        const deco = [];
        if (chp.underline !== Helper.UNDERLINE.NONE) {
            deco.push("underline");
        }
        if (chp.strikethrough || chp.dblstrikethrough) {
            deco.push("line-through");
        }

        if (deco.length > 0) {
            el.css("text-decoration", deco.join(" "));
        }
        if (chp.colorindex !== 0) {
            const color = this._doc._lookupColor(chp.colorindex);
            if (color != null) {
                el.css("color", Helper._colorToStr(color));
            }
        }
        if (chp.highlightindex !== 0) {
            const color = this._doc._lookupColor(chp.highlightindex);
            if (color != null) {
                el.css("background-color", Helper._colorToStr(color));
            }
        }
        el.css("font-size", Math.floor(chp.fontsize / 2) + "pt");
        if (chp.supersubscript === Helper.SUPERSUBSCRIPT.SUPERSCRIPT) {
            el.css("vertical-align", "super");
            el.css("font-size", Math.max(1, Math.floor(chp.fontsize / 2) - 2) + "pt");
        } else if (chp.supersubscript === Helper.SUPERSUBSCRIPT.SUBSCRIPT) {
            el.css("vertical-align", "sub");
            el.css("font-size", Math.max(1, Math.floor(chp.fontsize / 2) - 2) + "pt");
        }
    }

    public finalize() {
        Helper.log("[rtf] finalizing text element");
        this.applyProps();
        return super.finalize();
    }
}

export interface ISub {
    container: RenderElement;
    pap?: Pap;
    chp?: Chp;
}

export class RenderContainer extends RenderElement {
    public _content: JQuery;
    public _sub: ISub[];

    constructor(doc: Document, type: string, element: JQuery | HTMLElement, content: JQuery | HTMLElement) {
        super(doc, type, element);
        this._content = normalizeElement(content);
        this._sub = [];
    }

    public getType() {
        return this._type;
    }

    public getContent() {
        return this._content;
    }

    public appendSub(container: RenderContainer) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container,
        });
    }

    public _finalizeSub(sub: ISub, parentPap: Pap) {
        return sub.container.finalize();
    }

    public finalize() {
        Helper.log("[rtf] finalizing container " + this._type);
        if (this._sub == null) {
            throw new RTFJSError("Container already finalized");
        }

        const cont = this.getContent();
        const len = this._sub.length;
        for (let i = 0; i < len; i++) {
            const element = this._finalizeSub(this._sub[i], this._pap);
            if (element != null) {
                cont.append(element);
            }
        }
        delete this._sub;
        return this._element;
    }
}

export class RenderParagraphContainer extends RenderContainer {
    constructor(doc: Document) {
        const par = $("<div>");
        super(doc, "par", par, par);
    }

    public appendSub(container: RenderElement) {
        Helper.log("[rtf] appendSub for container " + this._type);
        this._sub.push({
            container,
            pap: container._pap != null ? container._pap : this._pap,
            chp: container._chp != null ? container._chp : this._chp,
        });
    }

    public updateProps(pap: Pap, chp: Chp) {
        this._pap = pap;
        this._chp = chp;

        if (this._sub.length > 0) {
            const sub = this._sub[this._sub.length - 1];
            sub.pap = pap;
            sub.chp = chp;
        }
    }

    public applyPap(el: JQuery, pap: Pap, chp: Chp) {
        pap = pap != null ? pap : new Pap(null);
        Helper.log("[rtf] RenderParagraphContainer applyPap: chp=" + JSON.stringify(chp)
            + " pap=" + JSON.stringify(pap));
        el = this.getElement();

        if (pap.spacebefore !== 0) {
            el.css("margin-top", Helper._twipsToPt(pap.spacebefore) + "pt");
        } else {
            el.css("margin-top", "");
        }
        if (pap.spaceafter !== 0) {
            el.css("margin-bottom", Helper._twipsToPt(pap.spaceafter) + "pt");
        } else {
            el.css("margin-bottom", "");
        }
        if (chp != null) {
            el.css("min-height", Math.floor(chp.fontsize / 2) + "pt");
        }

        switch (pap.justification) {
            case Helper.JUSTIFICATION.LEFT:
                el.css("text-align", "left");
                break;
            case Helper.JUSTIFICATION.RIGHT:
                el.css("text-align", "right");
                break;
            case Helper.JUSTIFICATION.CENTER:
                el.css("text-align", "center");
                break;
            case Helper.JUSTIFICATION.JUSTIFY:
                el.css("text-align", "justify");
                break;
        }
    }

    public _finalizeSub(sub: ISub, parentPap: Pap) {
        const element = sub.container.finalize();
        if (element) {
            this.applyPap(element, sub.pap ? sub.pap : parentPap, sub.chp);
        }
        return element;
    }

    public finalize() {
        Helper.log("[rtf] finalizing paragraph");
        if (this._sub == null) {
            throw new RTFJSError("Paragraph already finalized");
        }
        if (this._sub.length > 0) {
            return super.finalize();
        }

        delete this._sub;
        return null;
    }
}

export interface IRow {
    def: ITableRow;
    cells: ICell[];
}

export interface ICell {
    def: ITableCell;
    sub: ISub[];
}

export class RenderTableContainer extends RenderContainer {
    public _table: Tbl;
    public _rows: IRow[];
    public _row: IRow;
    public _cell: ICell;

    constructor(doc: Document, table: Tbl) {
        super(doc, "table", $("<table>"), null);
        this._table = table;
        this._rows = [];
        this._row = null;
        this._cell = null;
    }

    public appendCell() {
        Helper.log("[rtf] Table appending cell");
        if (this._row == null) {
            this.appendRow();
        }

        const cellIndex = this._row.cells.length;
        const cellDef = this._row.def.cells[cellIndex] || {
            left: 0,
            right: 0,
            borders: {},
        };

        this._cell = {
            def: cellDef,
            sub: [],
        };
        this._row.cells.push(this._cell);
    }

    public appendRow() {
        Helper.log("[rtf] Table appending row");
        const rowIndex = this._rows.length;
        const rowDef = this._table.rows[rowIndex] || {
            left: 0,
            cells: [],
        };
        this._row = {
            def: rowDef,
            cells: [],
        };
        this._rows.push(this._row);
    }

    public finishRow() {
        Helper.log("[rtf] Table finish row");
        this.finishCell();
        this._row = null;
    }

    public finishCell() {
        Helper.log("[rtf] Table finish cell");
        const len = this._sub.length;
        if (this._row == null) {
            this.appendRow();
        }
        if (this._cell == null) {
            this.appendCell();
        }

        for (let i = 0; i < len; i++) {
            this._cell.sub.push(this._sub[i]);
        }
        this._sub = [];

        this._cell = null;
    }

    private _getColumnBoundaries() {
        const boundaries: {[key: string]: boolean} = {};
        const rows = this._table.rows;
        const rlen = rows.length;

        for (let r = 0; r < rlen; r++) {
            const row = rows[r];
            boundaries[row.left.toString()] = true;
            const clen = row.cells.length;
            for (let c = 0; c < clen; c++) {
                const cell = row.cells[c];
                boundaries[cell.left.toString()] = true;
                boundaries[cell.right.toString()] = true;
            }
        }

        return Object.keys(boundaries).map((value) => parseInt(value, 10)).sort((a, b) => a - b);
    }

    private _getColumnIndex(boundaries: number[], value: number) {
        for (let i = 0; i < boundaries.length; i++) {
            if (boundaries[i] === value) {
                return i;
            }
        }
        return -1;
    }

    private _getColSpan(boundaries: number[], cell: ITableCell, row: ITableRow, cellIndex: number) {
        const start = this._getColumnIndex(boundaries, cell.left);
        let end = this._getColumnIndex(boundaries, cell.right);
        if (start < 0 || end < 0) {
            return 1;
        }

        while (cell.mergeStart === true && cellIndex + 1 < row.cells.length) {
            const next = row.cells[cellIndex + 1];
            if (next.mergeContinue !== true) {
                break;
            }
            end = this._getColumnIndex(boundaries, next.right);
            cellIndex++;
        }

        return Math.max(1, end - start);
    }

    private _getRowSpan(rowIndex: number, cellIndex: number, boundaries: number[]) {
        const row = this._table.rows[rowIndex];
        const cell = row.cells[cellIndex];

        if (cell.vMergeContinue === true) {
            return 0;
        }

        let span = 1;
        const start = this._getColumnIndex(boundaries, cell.left);
        const end = this._getColumnIndex(boundaries, cell.right);

        if (cell.vMergeStart !== true || start < 0 || end < 0) {
            return span;
        }

        for (let r = rowIndex + 1; r < this._table.rows.length; r++) {
            const nextRow = this._table.rows[r];
            const nextCell = nextRow.cells[cellIndex];
            if (nextCell == null || nextCell.vMergeContinue !== true) {
                break;
            }

            const nextStart = this._getColumnIndex(boundaries, nextCell.left);
            const nextEnd = this._getColumnIndex(boundaries, nextCell.right);
            if (nextStart !== start || nextEnd !== end) {
                break;
            }
            span++;
        }

        return span;
    }

    private _applyBorderStyle(element: JQuery, side: string, border: ITableBorder) {
        if (border == null) {
            return;
        }

        const style = border.style != null ? border.style : "solid";
        const width = border.width != null ? Math.max(1, Math.ceil(border.width / 16)) : 1;
        const color = border.colorindex != null ? this._doc._lookupColor(border.colorindex) : null;
        const colorStr = color != null ? Helper._colorToStr(color) : "rgb(0,0,0)";
        element.css("border-" + side, width + "px " + style + " " + colorStr);
    }

    private _applyCellStyle(element: JQuery, cell: ITableCell) {
        element.css("vertical-align", "top");
        const sides: TableBorderSide[] = ["top", "left", "bottom", "right"];
        for (let i = 0; i < sides.length; i++) {
            const side = sides[i];
            this._applyBorderStyle(element, side, cell.borders[side]);
        }
    }

    public finalize() {
        Helper.log("[rtf] Table finalize");
        if (this._sub == null) {
            throw new RTFJSError("Table container already finalized");
        }

        const boundaries = this._getColumnBoundaries();
        this._element.css("border-collapse", "collapse");

        const rlen = this._rows.length;
        Helper.log("[rtf] Table finalize: #rows: " + rlen);
        for (let r = 0; r < rlen; r++) {
            const row = this._rows[r];
            const rowElement = $("<tr>").appendTo(this._element);
            const clen = row.def.cells.length;
            Helper.log("[rtf] Table finalize: row[" + r + "].#cells: " + clen);
            for (let c = 0; c < clen; c++) {
                const cellDef = row.def.cells[c];
                if (cellDef == null || cellDef.mergeContinue === true) {
                    continue;
                }

                const rowSpan = this._getRowSpan(r, c, boundaries);
                if (rowSpan === 0) {
                    continue;
                }

                const cell = row.cells[c] || {
                    def: cellDef,
                    sub: [],
                };
                const cellElement = $("<td>").appendTo(rowElement);
                const colSpan = this._getColSpan(boundaries, cellDef, row.def, c);
                if (colSpan > 1) {
                    cellElement.attr("colspan", colSpan);
                }
                if (rowSpan > 1) {
                    cellElement.attr("rowspan", rowSpan);
                }
                this._applyCellStyle(cellElement, cellDef);

                const slen = cell.sub.length;
                Helper.log("[rtf] Table finalize: row[" + r + "].cell[" + c + "].#subs: " + slen);
                for (let s = 0; s < slen; s++) {
                    const sub = cell.sub[s];
                    const element = sub.container.finalize();
                    if (element != null) {
                        cellElement.append(element);
                    }
                }
            }
        }

        delete this._sub;

        return this._element;
    }
}
