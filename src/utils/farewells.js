export const farewells = [
  "Se precisar de mais ajuda, estou à disposição.",
  "Conte comigo para o que precisar.",
  "Qualquer outra dúvida, é só chamar.",
  "Caso tenha mais perguntas, estou por aqui.",
  "Estou à disposição para ajudar com outras questões também.",
  "Fico no aguardo se precisar de mais alguma coisa.",
  "Se precisar de assistência adicional, estou à disposição.",
  "Espero ter ajudado. Estou aqui caso precise de mais informações.",
  "Pode contar comigo para outras dúvidas.",
  "Até mais! Estou por aqui se precisar.",
  "Caso tenha outras dúvidas, é só perguntar.",
  "Estou aqui para o que precisar.",
  "Fico à disposição para ajudar com outras questões.",
  "Qualquer coisa, só me chamar.",
  "Até mais!",
];

export function getFarewell() {
  return farewells[Math.floor(Math.random() * farewells.length)];
}
