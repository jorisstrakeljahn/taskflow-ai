interface ParsedTask {
  title: string;
  group: string;
  parentId?: string;
}

/**
 * Simpler AI Parser - konvertiert Chat-Nachrichten in strukturierte Tasks
 * TODO: Später durch echten AI-Service ersetzen
 */
export const parseChatMessage = (message: string): ParsedTask[] => {
  const tasks: ParsedTask[] = [];

  // Gruppenerkennung
  const groupKeywords: Record<string, string[]> = {
    Work: ['arbeit', 'projekt', 'meeting', 'präsentation', 'office', 'beruf'],
    Personal: ['einkaufen', 'shopping', 'haushalt', 'putzen', 'wäsche'],
    Health: ['arzt', 'doktor', 'gesundheit', 'sport', 'training', 'fitness'],
    Finance: ['rechnung', 'bank', 'geld', 'finanzen', 'steuer'],
  };

  const detectGroup = (text: string): string => {
    for (const [group, keywords] of Object.entries(groupKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return group;
      }
    }
    return 'General';
  };

  // Einfache Parsing-Logik: Suche nach Satzzeichen und Aufzählungen
  const separators = [
    /,\s*(?:und|oder)\s*/gi,
    /\.\s+/g,
    /;\s+/g,
    /\n+/g,
    /,\s+/g,
  ];

  let parts: string[] = [message];

  for (const separator of separators) {
    const newParts: string[] = [];
    for (const part of parts) {
      newParts.push(...part.split(separator));
    }
    parts = newParts;
  }

  // Bereinige und filtere leere Teile
  parts = parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && p.length < 200);

  // Erstelle Tasks aus den Teilen
  for (const part of parts) {
    if (part.length < 3) continue;

    // Entferne häufige Füllwörter am Anfang
    const cleaned = part
      .replace(/^(ich muss|ich sollte|ich will|ich möchte|dann|und|oder)\s+/i, '')
      .trim();

    if (cleaned.length < 3) continue;

    tasks.push({
      title: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      group: detectGroup(cleaned),
    });
  }

  // Falls keine Tasks gefunden wurden, erstelle einen aus der gesamten Nachricht
  if (tasks.length === 0) {
    tasks.push({
      title: message.trim(),
      group: detectGroup(message),
    });
  }

  return tasks;
};

