import { Request, Response } from "express";
import React from "react";
export declare const path: string;
interface IEsiAttrs {
    src?: string;
    alt?: string;
    onerror?: string;
}
interface IEsiProps {
    attrs?: IEsiAttrs;
}
/**
 * Creates the <esi:include> tag.
 */
export declare const createIncludeElement: (fragmentID: string, props: object, esi: IEsiProps) => string;
interface IServeFragmentOptions {
    pipeStream?: (stream: NodeJS.ReadableStream) => NodeJS.ReadableStream;
}
declare type resolver = (fragmentID: string, props: object, req: Request, res: Response) => React.ComponentType<any>;
/**
 * Checks the signature, renders the given fragment as HTML and injects the initial props in a <script> tag.
 */
export declare function serveFragment(req: Request, res: Response, resolve: resolver, options?: IServeFragmentOptions): Promise<void>;
export {};
