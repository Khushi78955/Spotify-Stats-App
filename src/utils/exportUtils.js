import html2canvas from 'html2canvas';

export async function downloadPersonalityCard(elementRef) {
  if (!elementRef.current) return;

  const canvas = await html2canvas(elementRef.current, {
    scale: 2,
    backgroundColor: '#1a1a24',
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
  });

  const link = document.createElement('a');
  link.download = 'my-music-personality.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
