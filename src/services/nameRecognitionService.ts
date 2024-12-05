export const extractNameFromText = (text: string): string | null => {
  // Melhorando os padrões de reconhecimento de nomes em português
  const patterns = [
    /meu nome[^\w]*(é|eh)[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /me chamo[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /sou[^\w]*(o|a)?[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)[^\w]*falando/i,
    /aqui[^\w]*(é|eh)[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /presente[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      // Pega o último grupo de captura que contém o nome
      const name = match[match.length - 1].trim();
      console.log('Nome identificado:', name);
      return name;
    }
  }
  return null;
};

export const handleNameRecognition = (transcript: string): string | null => {
  console.log('Analisando transcrição para nomes:', transcript);
  const name = extractNameFromText(transcript);
  if (name) {
    console.log('Nome identificado e processado:', name);
    return name;
  }
  return null;
};