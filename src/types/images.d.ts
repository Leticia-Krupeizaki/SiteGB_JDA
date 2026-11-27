// Tipos dos imports de imagem (png, jpg, webp...) do Next. O next-env.d.ts fica fora
// do git, então sem este arquivo o "tsc --noEmit" do CI falha nos imports de foto.
/// <reference types="next/image-types/global" />
