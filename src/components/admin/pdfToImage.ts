/**
 * Converte a 1ª página de um PDF em imagem, no navegador (o servidor só aceita
 * imagens). Os currículos da GB são pôsteres de uma página; a largura de 1800 px
 * é a mesma usada no site para o texto pequeno continuar legível.
 * pdf.js é carregado só quando um PDF é escolhido.
 */
export async function pdfToImage(file: File, targetWidth = 1800): Promise<{ blob: Blob; pages: number }> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: targetWidth / page.getViewport({ scale: 1 }).width });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    // Fundo branco: PDF sem fundo ficaria transparente (preto em alguns visualizadores).
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    // PNG: sem perda antes do reprocessamento no servidor.
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Não foi possível gerar a imagem do PDF.');
    return { blob, pages: pdf.numPages };
  } finally {
    void task.destroy();
  }
}
