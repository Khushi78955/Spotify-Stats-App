import html2canvas from 'html2canvas';

async function renderCard(elementRef) {
  return html2canvas(elementRef.current, {
    scale: 2,
    backgroundColor: '#1a1a24',
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
  });
}

export async function downloadPersonalityCard(elementRef) {
  if (!elementRef.current) return;
  const canvas = await renderCard(elementRef);
  const link = document.createElement('a');
  link.download = 'my-music-personality.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Returns true if the browser supports file sharing (most mobile browsers do).
export function canShare() {
  return typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

export async function sharePersonalityCard(elementRef) {
  if (!elementRef.current) return;
  const canvas = await renderCard(elementRef);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], 'my-music-personality.png', { type: 'image/png' });

  if (navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'My Music Personality',
      text: 'Check out my music personality card from Statify 🎵',
    });
  } else {
    // Fallback: if file sharing isn't supported, download instead
    await downloadPersonalityCard(elementRef);
  }
}
