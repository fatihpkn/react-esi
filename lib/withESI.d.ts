import React from "react";
declare global {
    interface Window {
        __REACT_ESI__: {
            [s: string]: object;
        };
    }
}
interface IWithESIProps {
    esi?: {
        attrs?: {
            [key: string]: string | null;
        };
    };
}
/**
 * Higher Order Component generating a <esi:include> tag server-side, and rendering the wrapped component client-side.
 */
export default function withESI<P>(WrappedComponent: React.ComponentType<P>, fragmentID: string): React.ComponentClass<IWithESIProps & P>;
export {};
