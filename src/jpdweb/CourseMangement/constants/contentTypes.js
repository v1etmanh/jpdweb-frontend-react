// constants/contentTypes.js
import {
  Brain,
  Video,
  Headphones,
  CheckSquare,
  Edit,
  BookOpen,
  Mic,
  MicIcon,
  PenTool,
  FileText,
} from 'lucide-react';

export const CONTENT_TYPES = {
  FLASHCARD: { icon: Brain, label: 'Flashcard', color: 'text-blue-600' },
  VIDEO: { icon: Video, label: 'Video Upload', color: 'text-green-600' },
  LISTEN_CHOICE: { icon: Headphones, label: 'Listening Choice', color: 'text-purple-600' },
  MULTIPLE_CHOICE: { icon: CheckSquare, label: 'Multiple Choice', color: 'text-orange-600' },
  GAPFILL: { icon: Edit, label: 'Gap Fill', color: 'text-indigo-600' },
  READING: { icon: BookOpen, label: 'Reading Question', color: 'text-teal-600' },
  SPEAKING_PASSAGE: { icon: Mic, label: 'Speaking Passage', color: 'text-pink-600' },
  SPEAKING_PICTURE: { icon: MicIcon, label: 'Speaking Picture', color: 'text-rose-600' },
  WRITING: { icon: PenTool, label: 'Writing Question', color: 'text-amber-600' },
  PDF: { icon: FileText, label: 'PDF Document', color: 'text-amber-600' },
};