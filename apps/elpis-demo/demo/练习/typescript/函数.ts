// 有返回值的
function add(n1: number, n2: number): number {
  return n1 + n2
}

// 没有返回值的
function log() {
  console.log(123)
}

interface ButtonProps {
  type: 'primary' | 'danger'
  click(e: MouseEvent): void
}

// interface InputProps {
//     value: string;
//     // change(value: string): void;
//     change: (value: string) => void;
// }
