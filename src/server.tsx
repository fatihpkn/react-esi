import { PipeableStream, renderToNodeStream, renderToPipeableStream, version } from "react-dom/server";
import { Readable, Transform } from "stream";
import { Request, Response } from "express";

import React from "react";

export const path = process.env.REACT_ESI_PATH || process.env.NEXT_PUBLIC_REACT_ESI_PATH || "/arac-kiralama/_eufragment";

const streamMethod = !React.version.startsWith('18.') && !version.startsWith('18.') ? renderToNodeStream : renderToPipeableStream;

/**
 * Escapes ESI attributes.
 *
 * Adapted from https://stackoverflow.com/a/27979933/1352334 (hgoebl)
 */
function escapeAttr(attr: string): string {
  return attr.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });
}

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
export const createIncludeElement = (fragmentID: string, props: object, esi: IEsiProps) => {
  const esiAt = esi.attrs || {};

  const url = new URL(path, "http://example.com");
  url.searchParams.append("fragment", fragmentID);
  url.searchParams.append("props", JSON.stringify(props));

  esiAt.src = url.pathname + url.search;
  let attrs = "";
  Object.entries(esiAt).forEach(([key, value]) => (attrs += ` ${key}="${value ? escapeAttr(value) : ""}"`));

  return `<esi:include${attrs} />`;
};

type transformCallback = (error?: Error, data?: any) => void;

/**
 * Removes the placeholder holding the data-reactroot attribute.
 */
class RemoveReactRoot extends Transform {
  public skipStartOfDiv = true;
  public bufferedEndOfDiv = false;

  public _transform(chunk: any, encoding: string, callback: transformCallback) {
    // '<div data-reactroot="">'.length is 23
    chunk = chunk.toString();
    if (this.skipStartOfDiv) {
      // Skip the wrapper start tag
      chunk = chunk.substring(23);
      this.skipStartOfDiv = false;
    }

    if (this.bufferedEndOfDiv) {
      // The buffered end tag wasn't the last one, push it
      chunk = "</div>" + chunk;
      this.bufferedEndOfDiv = false;
    }

    if (chunk.substring(chunk.length - 6) === "</div>") {
      chunk = chunk.substring(0, chunk.length - 6);
      this.bufferedEndOfDiv = true;
    }

    callback(undefined, chunk);
  }
}

interface IServeFragmentOptions {
  pipeStream?: (stream: NodeJS.ReadableStream) => NodeJS.ReadableStream;
  public_base?: string;
}

type resolver = (fragmentID: string, props: object, req: Request, res: Response) => React.ComponentType<any>;

/**
 * Checks the signature, renders the given fragment as HTML and injects the initial props in a <script> tag.
 */
export async function serveFragment(req: Request, res: Response, resolve: resolver, options: IServeFragmentOptions = {}) {
  const url = new URL(req.url, "http://example.com");

  const rawProps = url.searchParams.get("props");
  const props = rawProps ? JSON.parse(rawProps) : {};

  const fragmentID = url.searchParams.get("fragment") || "";

  const Component = resolve(fragmentID, props, req, res);
  const { esi, ...baseChildProps } = props;

  const childProps = (Component as any).getInitialProps
    ? await (Component as any).getInitialProps({
        props: baseChildProps,
        req,
        res,
      })
    : baseChildProps;

  // Inject the initial props
  const encodedProps = JSON.stringify(childProps).replace(/</g, "\\u003c");

  // Remove the <script> class from the DOM to prevent breaking the React reconciliation algorithm
  const script = "<script>window.__REACT_ESI__ = window.__REACT_ESI__ || {}; window.__REACT_ESI__['" + fragmentID + "'] = " + encodedProps + ";document.currentScript.remove();</script>";
  const scriptStream = Readable.from(script);
  scriptStream.pipe(res, { end: false });
  const jsx = <Component {...childProps} />;
  const stream = streamMethod(<div>{jsx}</div>);

  const removeReactRootStream = new RemoveReactRoot();
  //@ts-ignore
  stream.pipe(removeReactRootStream);

  const lastStream: NodeJS.ReadableStream = options.pipeStream ? options.pipeStream(removeReactRootStream) : removeReactRootStream;

  lastStream.pipe(res);
}
