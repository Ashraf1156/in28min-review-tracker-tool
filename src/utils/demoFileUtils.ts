
import { DemoNode } from "./DemoDoublyLinkedList";

export const generateDemoReviewReport = (demos: DemoNode[]): string => {
  let report = "DEMO REVIEW REPORT\n";
  report += "===================\n\n";

  demos.forEach(demo => {
    report += `Demo ${demo.id}:\n`;
    report += `URL: ${demo.url}\n`;
    if (demo.remarks.trim() === "") {
      report += "Everything is Fine\n";
    } else {
      report += "Everything is Fine\n";
      report += `Remarks: ${demo.remarks}\n`;
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
