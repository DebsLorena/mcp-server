export function removeMarkdownFormatting(text) {
  return text
    // Remove negrito (**texto** ou __texto__)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    
    // Remove itálico (*texto*, _texto_, //texto//)
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/\/\/(.*?)\/\//g, '$1')

    // Remove código em linha (`texto`)
    .replace(/`([^`]*)`/g, '$1')

    // Remove cabeçalhos Markdown (#, ##, etc.)
    .replace(/^#+\s?(.*)/gm, '$1')

    // Remove imagens e links customizados ({{imagem}}, [[link]])
    .replace(/\{\{.*?\}\}/g, '')
    .replace(/\[\[.*?\]\]/g, '')

    // Remove listas com *, -, ou números
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')

    // Remove barras invertidas usadas como escape (ex: \\n, \\t)
    .replace(/\\\\/g, '')

    // Remove quebras de linha múltiplas
    .replace(/\n{2,}/g, '\n\n')

    // Remove espaços em branco no início e fim
    .trim();
}
