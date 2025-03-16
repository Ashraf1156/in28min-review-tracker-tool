
export interface SlideNode {
  id: number;
  remarks: string;
  reviewed: boolean;
  prev: SlideNode | null;
  next: SlideNode | null;
}

export class DoublyLinkedList {
  head: SlideNode | null;
  tail: SlideNode | null;
  current: SlideNode | null;
  totalSlides: number;
  reviewedSlides: number;

  constructor(totalSlides: number) {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.totalSlides = totalSlides;
    this.reviewedSlides = 0;
    this.initialize(totalSlides);
  }

  private initialize(totalSlides: number): void {
    if (totalSlides <= 0) return;

    // Create first node
    const firstNode: SlideNode = {
      id: 1,
      remarks: "",
      reviewed: false,
      prev: null,
      next: null
    };
    
    this.head = firstNode;
    this.current = firstNode;
    
    let currentNode = firstNode;
    
    // Create remaining nodes and link them
    for (let i = 2; i <= totalSlides; i++) {
      const newNode: SlideNode = {
        id: i,
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

  moveNext(): SlideNode | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current;
    }
    return null;
  }

  movePrev(): SlideNode | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current;
    }
    return null;
  }

  updateCurrentSlide(remarks: string): void {
    if (this.current) {
      const wasReviewed = this.current.reviewed;
      this.current.remarks = remarks;
      this.current.reviewed = true;
      
      if (!wasReviewed) {
        this.reviewedSlides++;
      }
    }
  }

  getSlidesRemaining(): number {
    return this.totalSlides - this.reviewedSlides;
  }

  getCompletionPercentage(): number {
    return (this.reviewedSlides / this.totalSlides) * 100;
  }

  getAllSlides(): SlideNode[] {
    const slides: SlideNode[] = [];
    let current = this.head;
    
    while (current) {
      slides.push(current);
      current = current.next;
    }
    
    return slides;
  }

  isComplete(): boolean {
    return this.reviewedSlides === this.totalSlides;
  }
}
