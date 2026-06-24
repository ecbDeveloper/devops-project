export const baixarImagem = async (url: string, extensao: string, nome_arquivo: string) => {
    const response = await fetch(url);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nome_arquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
}

export const base64ParaArquivo = (base64: string, nome: string) => {
    const byteCharacters = atob(base64);
    const bytes = [];


    for (let offset = 0; offset < byteCharacters.length; offset++) {
        bytes.push(byteCharacters.charCodeAt(offset));
    }

    const blob = new Blob([new Uint8Array(bytes)]);

    const file = new File([blob], nome);
    
    return file;
}