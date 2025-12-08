# AI Integration

Documentation for the OpenAI integration in TaskFlow AI.

## Overview

TaskFlow AI uses OpenAI's GPT-4o-mini model to convert natural language messages into structured tasks. Users can simply type their thoughts, and the AI will parse them into actionable tasks with appropriate groups, priorities, and descriptions.

## Configuration

### OpenAI API Key

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```
3. Restart the dev server after adding the key

### Model Settings

The AI integration uses the following configuration (in `src/constants/aiConstants.ts`):

- **Model**: `gpt-4o-mini`
- **Max Tokens**: 1000
- **Temperature**: 0.7

## System Prompt

The system prompt is stored in `public/prompts/ai-prompt.txt` and defines how the AI should parse user messages.

### Prompt Structure

The prompt instructs the AI to:

1. Extract actionable tasks from natural language
2. Assign appropriate groups (using existing groups when possible)
3. Detect priority levels when indicated
4. Return structured JSON with task data

### Customizing the Prompt

To customize the AI behavior:

1. Edit `public/prompts/ai-prompt.txt`
2. Restart the dev server
3. Test with sample messages

## How It Works

### User Flow

1. User opens the Chat modal
2. User types a natural language message (e.g., "I need to buy groceries and finish the report")
3. AI processes the message and generates task suggestions
4. User reviews, edits, or accepts the suggestions
5. Tasks are created in Firestore

### Technical Flow

1. `ChatModal` sends message to `handleChatMessage` in `App.tsx`
2. `generateTasksFromMessage` in `openaiService.ts`:
   - Loads system prompt from `public/prompts/ai-prompt.txt`
   - Enhances prompt with existing task groups
   - Calls OpenAI API with user message
   - Validates and parses JSON response
3. Suggestions are displayed in `ChatModal`
4. User can edit, remove, or add tasks individually
5. Selected tasks are created via `handleAddTasks`

## Error Handling

### API Key Missing

If `VITE_OPENAI_API_KEY` is not set:

- Error message displayed in Chat modal
- User cannot generate tasks
- Instructions shown to add API key

### API Errors

If OpenAI API call fails:

- Error message displayed with details
- User can retry or check API key
- Fallback behavior: no tasks generated

### Network Errors

If network request fails:

- Error message displayed
- User can retry the request

## Best Practices

### Prompt Engineering

- Keep instructions clear and specific
- Provide examples in the prompt
- Update prompt based on user feedback
- Test with various message formats

### Cost Optimization

- Use `gpt-4o-mini` (cost-effective)
- Limit `max_tokens` to 1000
- Cache system prompt (loaded once per session)

### User Experience

- Show loading state during API calls
- Display clear error messages
- Allow users to edit suggestions before adding
- Provide "regenerate" option

## Troubleshooting

### Tasks Not Generated

1. Check API key in `.env` file
2. Verify API key is valid at [OpenAI Platform](https://platform.openai.com/api-keys)
3. Check browser console for errors
4. Verify system prompt file exists at `public/prompts/ai-prompt.txt`

### Invalid JSON Response

- Check system prompt format
- Verify OpenAI API is returning JSON
- Check browser console for parsing errors

### Slow Response Times

- Check network connection
- Verify OpenAI API status
- Consider reducing `max_tokens` if needed

## Future Enhancements

Potential improvements:

- Support for multiple AI models
- Custom prompt templates
- Task suggestion history
- Learning from user edits
- Batch processing for multiple messages
