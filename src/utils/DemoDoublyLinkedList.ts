
export interface DemoNode {
  id: number;
  url: string;
  remarks: string;
  reviewed: boolean;
  prev: DemoNode | null;
  next: DemoNode | null;
}

export class DemoDoublyLinkedList {
  head: DemoNode | null;
  tail: DemoNode | null;
  current: DemoNode | null;
  totalDemos: number;
  reviewedDemos: number;

  constructor(demoUrls: string[]) {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.totalDemos = demoUrls.length;
    this.reviewedDemos = 0;
    this.initialize(demoUrls);
  }

  private initialize(demoUrls: string[]): void {
    if (demoUrls.length <= 0) return;

    // Create first node
    const firstNode: DemoNode = {
      id: 1,
      url: demoUrls[0],
      remarks: "",
      reviewed: false,
      prev: null,
      next: null
    };
    
    this.head = firstNode;
    this.current = firstNode;
    
    let currentNode = firstNode;
    
    // Create remaining nodes and link them
    for (let i = 1; i < demoUrls.length; i++) {
      const newNode: DemoNode = {
        id: i + 1,
        url: demoUrls[i],
        remarks: "",
        reviewed: false,
        prev: currentNode,
        next: null
      };
      
      currentNode.next = newNode;
      currentNode = newNode;
    }
    
    this.tail = currentNode;
  }

  moveNext(): DemoNode | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current;
    }
    return null;
  }

  movePrev(): DemoNode | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current;
    }
    return null;
  }

  updateCurrentDemo(remarks: string): void {
    if (this.current) {
      const wasReviewed = this.current.reviewed;
      this.current.remarks = remarks;
      this.current.reviewed = true;
      
      if (!wasReviewed) {
        this.reviewedDemos++;
      }
    }
  }

  getDemosRemaining(): number {
    return this.totalDemos - this.reviewedDemos;
  }

  getCompletionPercentage(): number {
    return (this.reviewedDemos / this.totalDemos) * 100;
  }

  getAllDemos(): DemoNode[] {
    const demos: DemoNode[] = [];
    let current = this.head;
    
    while (current) {
      demos.push(current);
      current = current.next;
    }
    
    return demos;
  }

  isComplete(): boolean {
    return this.reviewedDemos === this.totalDemos;
  }
}
