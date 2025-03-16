
import { SlideNode } from "./DoublyLinkedList";

export const generateReviewReport = (slides: SlideNode[]): string => {
  let report = "SLIDE REVIEW REPORT\n";
  report += "===================\n\n";

  slides.forEach(slide => {
    report += `Slide ${slide.id}:\n`;
    if (slide.remarks.trim() === "") {
      report += "Everything is Fine\n";
    } else {
      report += "Everything is Fine\n";
      report += `Remarks: ${slide.remarks}\n`;
    }
    report += "-------------------\n\n";
  });

  report += "End of Report";
  return report;
};

export const downloadTextFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
