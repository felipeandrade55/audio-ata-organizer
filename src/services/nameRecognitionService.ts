export const extractNameFromText = (text: string): string | null => {
  const patterns = [
    /meu nome[^\w]*(é|eh)[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /me chamo[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /sou[^\w]*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/i,
    /([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)[^\w]*falando/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[match.length - 1]) {
      return match[match.length - 1].trim();
    }
  }
  return null;
};

export const handleNameRecognition = (transcript: string): string | null => {
  const name = extractNameFromText(transcript);
  if (name) {
    console.log('Nome identificado:', name);
    return name;
  }
  return null;
};