/// <reference types="jquery" />
import { Document } from "../Document";
import { Chp, Pap } from "../parser/Containers";
import { RenderContainer, RenderElement } from "./RenderElements";
export interface IContainerElement {
    element: HTMLElement;
    content: HTMLElement;
}
export declare class Renderer {
    _doc: Document;
    private _dom;
    private _chp;
    private _pap;
    private _curpar;
    private _cursubparIdx;
    private _curcont;
    constructor(doc: Document);
    pushContainer(container: RenderContainer): void;
    currentContainer(type: string): RenderContainer;
    popContainer(type?: string): RenderContainer;
    buildHyperlinkElement(url: string): HTMLElement;
    _appendToPar(content: RenderElement | null, newsubpar?: boolean): void;
    finishPar(): void;
    lineBreak(): void;
    finishRow(): void;
    finishCell(): void;
    setChp(chp: Chp): void;
    setPap(pap: Pap): void;
    appendElement(element: JQuery | HTMLElement): void;
    buildRenderedPicture(element: JQuery | HTMLElement): RenderElement;
    renderedPicture(element: JQuery | HTMLElement): void;
    buildPicture(mime: string, data: string): RenderElement;
    picture(mime: string, data: string): void;
    buildDom(): HTMLElement[];
}
