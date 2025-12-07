interface ParsedTask {
  title: string;
  group: string;
  parentId?: string;
}

/**
 * Simple AI Parser - converts chat messages into structured tasks
 * TODO: Replace with real AI service later
 */
export const parseChatMessage = (message: string): ParsedTask[] => {
  const tasks: ParsedTask[] = [];

  // Group detection
  const groupKeywords: Record<string, string[]> = {
    Work: ['work', 'project', 'meeting', 'presentation', 'office', 'job', 'career'],
    Personal: ['shopping', 'grocery', 'household', 'cleaning', 'laundry'],
    Health: ['doctor', 'appointment', 'health', 'sport', 'training', 'fitness', 'exercise'],
    Finance: ['bill', 'bank', 'money', 'finance', 'tax'],
  };

  const detectGroup = (text: string): string => {
    for (const [group, keywords] of Object.entries(groupKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return group;
      }
    }
    return 'General';
  };

  // Simple parsing logic: search for punctuation and lists
  const separators = [/,\s*(?:and|or)\s*/gi, /\.\s+/g, /;\s+/g, /\n+/g, /,\s+/g];

  let parts: string[] = [message];

  for (const separator of separators) {
    const newParts: string[] = [];
    for (const part of parts) {
      newParts.push(...part.split(separator));
    }
    parts = newParts;
  }

  // Clean and filter empty parts
  parts = parts.map((p) => p.trim()).filter((p) => p.length > 0 && p.length < 200);

  // Create tasks from parts
  for (const part of parts) {
    if (part.length < 3) continue;

    // Remove common filler words at the beginning
    const cleaned = part
      .replace(/^(i need|i should|i want|i would like|then|and|or)\s+/i, '')
      .trim();

    if (cleaned.length < 3) continue;

    tasks.push({
      title: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      group: detectGroup(cleaned),
    });
  }

  // If no tasks found, create one from the entire message
  if (tasks.length === 0) {
    tasks.push({
      title: message.trim(),
      group: detectGroup(message),
    });
  }

  return tasks;
};
