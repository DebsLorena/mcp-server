export function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const greetingList = [
  "oi", "ola", "olá", "bom dia", "boa tarde", "boa noite", "e ai", "fala",
  "salve", "tudo bem", "tudo bom", "como vai", "como está", "como esta",
  "boa madrugada", "saudações", "hey", "yo", "opa", "alo", "hello", "hi"
];

export function cleanText(text) {
  return removeAccents(text.toLowerCase().trim())
    .replace(/[^\w\s]/gi, '') 
    .replace(/\s+/g, ' ');  
}

export function isGreetingOnly(input) {
  const cleaned = cleanText(input);
  return greetingList.some(
    g => cleaned === g || cleaned.startsWith(g + " ")
  );
}

export const greetings = {
  morning: [
    "Bom dia! Como posso te ajudar hoje?",
    "Olá, bom dia! Pronto para começar?",
    "Bom dia! Em que posso ser útil?",
    "Oi! Desejo um ótimo começo de dia!",
    "Bom dia! Vamos resolver sua dúvida juntos?",
  ],
  afternoon: [
    "Boa tarde! Como posso te ajudar?",
    "Oi, boa tarde! Em que posso ser útil agora?",
    "Olá! Boa tarde! Vamos lá:",
    "Boa tarde! Conte comigo para o que precisar.",
    "Boa tarde! Aqui está o que encontrei para você:",
  ],
  evening: [
    "Boa noite! Posso te ajudar com alguma coisa?",
    "Oi! Boa noite. Em que posso colaborar?",
    "Olá! Boa noite! Vamos resolver isso juntos.",
    "Boa noite! Estou por aqui, pronto para ajudar.",
  ],
  general: [
    "Olá!",
    "Oi, tudo bem?",
    "Seja bem-vindo!",
    "Olá! Estou à disposição.",
    "Oi! Vamos lá:",
    "Oi! Aqui está o que encontrei:",
  ]
};

export function getGreeting() {
  try {
    const hour = new Date().getHours();
    let options = greetings.general;

    if (hour >= 5 && hour < 12) options = greetings.morning;
    else if (hour >= 12 && hour < 18) options = greetings.afternoon;
    else options = greetings.evening;

    return options[Math.floor(Math.random() * options.length)];
  } catch {
    return greetings.general[Math.floor(Math.random() * greetings.general.length)];
  }
}
