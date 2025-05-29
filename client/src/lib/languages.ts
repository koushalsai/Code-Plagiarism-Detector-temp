import { FaJs, FaPython, FaJava } from "react-icons/fa";
import { SiCplusplus, SiDotnet } from "react-icons/si";

export interface Language {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export const LANGUAGES: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: FaJs,
    color: "text-yellow-500",
    description: "ES6+ syntax support",
  },
  {
    id: "python",
    name: "Python",
    icon: FaPython,
    color: "text-blue-500",
    description: "Python 3.x optimized",
  },
  {
    id: "java",
    name: "Java",
    icon: FaJava,
    color: "text-red-500",
    description: "OOP pattern detection",
  },
  {
    id: "cpp",
    name: "C++",
    icon: SiCplusplus,
    color: "text-blue-600",
    description: "Template-aware analysis",
  },
  {
    id: "csharp",
    name: "C#",
    icon: SiDotnet,
    color: "text-purple-500",
    description: ".NET framework support",
  },
];
