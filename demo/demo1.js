 

class Node1 {
    constructor(value) {
        this.value = value;
        this.next = null
    } 
}

const a = new Node1(1);
const b = new Node1(1);
const c = new Node1(1);
const d = new Node1(1);
a.next = b;
b.next = c;
c.next = d;
d.next = null;


// 对链表进行循环遍历
function test1() {




}
test1(a)

function reverce(root){ 
    // 倒数第二个节点不存在
    if (root.next.next === null) { 
        root.next.next = root;
        return root.next; 
    }

    // 倒数第二个节点存在
    if (root.next.next !== null) {
        const result = reverce(root.next);
        root.next.next = root;
        root.next = null;
        return result;
    }

}

const a = reverce(a);







console.log( !!(-0), !!(0), !!(+0))





