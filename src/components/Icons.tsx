/**
 * Icon components using lucide-react
 * All icons are re-exported from lucide-react with consistent styling
 */

import {
  Plus,
  PlusCircle,
  X,
  Edit,
  Trash2,
  FileText,
  MessageSquare,
  Cog,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  User,
  Check,
  BarChart3,
  Filter,
  Folder,
  Layers,
  Zap,
  CheckCircle2,
  Palette,
  Sun,
  Moon,
  Monitor,
  GripVertical,
  LogOut,
  Shield,
  Mail,
  Key,
  type LucideProps,
} from 'lucide-react';
import type { CSSProperties, ComponentType } from 'react';

interface IconProps {
  className?: string;
  size?: number;
  style?: CSSProperties;
}

// Wrapper component to maintain consistent API
const createIcon = (IconComponent: ComponentType<LucideProps>) => {
  return ({ className = '', size = 24, style }: IconProps) => (
    <IconComponent 
      className={className} 
      size={size} 
      style={style}
      strokeWidth={2}
    />
  );
};

// Export all icons with consistent naming
export const IconPlus = createIcon(Plus);
export const IconClose = createIcon(X);
export const IconEdit = createIcon(Edit);
export const IconTrash = createIcon(Trash2);
export const IconTask = createIcon(FileText);
export const IconChat = createIcon(MessageSquare);
export const IconSettings = createIcon(Cog); // Using Cog (gear) icon for settings
export const IconGear = createIcon(Cog); // Alias - using Cog for settings
export const IconReset = createIcon(RotateCcw);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronDown = createIcon(ChevronDown);
export const IconUser = createIcon(User);
export const IconCheck = createIcon(Check);
export const IconBarChart = createIcon(BarChart3);
export const IconFilter = createIcon(Filter);
export const IconFolder = createIcon(Folder);
export const IconLayers = createIcon(Layers); // Stack icon for status filter
export const IconAddSubtask = createIcon(PlusCircle); // PlusCircle for add subtask
export const IconZap = createIcon(Zap);
export const IconCheckCircle = createIcon(CheckCircle2);
export const IconPalette = createIcon(Palette);
export const IconSun = createIcon(Sun);
export const IconMoon = createIcon(Moon);
export const IconMonitor = createIcon(Monitor);
export const IconGripVertical = createIcon(GripVertical);
export const IconLogOut = createIcon(LogOut);
export const IconShield = createIcon(Shield);
export const IconMail = createIcon(Mail);
export const IconKey = createIcon(Key);
