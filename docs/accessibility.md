# Accessibility Guide

## Overview

TaskFlow AI is designed with accessibility in mind, following WCAG 2.1 guidelines to ensure the application is usable by everyone, including users with disabilities.

## Keyboard Navigation

### Keyboard Shortcuts

The application supports the following keyboard shortcuts:

| Shortcut       | Action        | Description                                |
| -------------- | ------------- | ------------------------------------------ |
| `Ctrl/Cmd + K` | Open Chat     | Opens the AI chat modal to create tasks    |
| `Ctrl/Cmd + N` | Create Task   | Opens the create task modal                |
| `Escape`       | Close Modal   | Closes the currently open modal            |
| `Tab`          | Navigate      | Move focus to next interactive element     |
| `Shift + Tab`  | Navigate Back | Move focus to previous interactive element |
| `Enter`        | Submit        | Submit forms or confirm actions            |
| `Space`        | Toggle        | Toggle checkboxes and buttons              |

### Focus Management

- **Modals**: Focus is automatically trapped within open modals
- **Initial Focus**: When a modal opens, focus moves to the close button or first interactive element
- **Focus Restoration**: When a modal closes, focus returns to the element that opened it
- **Visual Focus**: All interactive elements have visible focus indicators

## ARIA Labels

All interactive elements have appropriate ARIA labels for screen readers:

### Buttons

- All icon-only buttons have descriptive `aria-label` attributes
- Action buttons (Edit, Delete, Add Subtask) include context in their labels
- Modal close buttons are labeled "Close modal"

### Modals

- Modals use `role="dialog"` and `aria-modal="true"`
- Modal titles are linked using `aria-labelledby`
- Filter sections use `aria-expanded` and `aria-controls` for collapsible content

### Form Elements

- All form inputs have associated labels
- Required fields are clearly marked
- Error messages are associated with their inputs using `aria-describedby`

## Screen Reader Support

### Task Items

- Checkboxes have descriptive labels: "Mark as done/open: [Task Title]"
- Task status is announced when changed
- Subtask relationships are communicated through hierarchy

### Navigation

- Main navigation elements are properly labeled
- Filter buttons indicate their current state
- Action buttons describe their function

## Best Practices

### For Developers

1. **Always add ARIA labels** to icon-only buttons
2. **Use semantic HTML** (buttons for actions, links for navigation)
3. **Test with keyboard navigation** - ensure all functionality is accessible via keyboard
4. **Test with screen readers** - use NVDA (Windows), VoiceOver (macOS), or JAWS
5. **Maintain focus order** - ensure logical tab order throughout the application

### Testing

To test accessibility:

1. **Keyboard Navigation**: Navigate the entire app using only the keyboard
2. **Screen Reader**: Test with a screen reader to ensure all content is announced correctly
3. **Focus Indicators**: Verify all interactive elements have visible focus states
4. **Color Contrast**: Ensure text meets WCAG AA contrast requirements (4.5:1 for normal text)

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
