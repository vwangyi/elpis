// shims-bpmn.d.ts
declare module '*.bpmn?raw' {
  const content: string;
  export default content;
}

declare module '*.bpmn' {
  const content: string;
  export default content;
}
