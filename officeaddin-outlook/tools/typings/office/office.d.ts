/**
 * Brute force TypeScript type definition used by Office.js.
 */

declare module Office {
  export function initialize():any;

  export var cast:any;
  export var context:any;
}

declare module 'Office' {
  var out:typeof Office;
  export = out;
}
