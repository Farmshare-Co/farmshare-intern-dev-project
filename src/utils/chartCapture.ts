import html2canvas from "html2canvas";

async function elementToDataUrl(el: HTMLElement): Promise<string> {
  const canvas = await html2canvas(el, {
    backgroundColor: null,
    scale: 2,            
    useCORS: true,
    logging: false,
  });
  return canvas.toDataURL("image/png");
}

export async function captureChartsFromContainer(
  container: HTMLElement,
): Promise<string[]> {
  const cards = Array.from(container.querySelectorAll<HTMLElement>(".chart-card"));
  return Promise.all(cards.map(elementToDataUrl));
}
