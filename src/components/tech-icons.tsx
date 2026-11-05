import type { ComponentType } from "react";
import {
  SiClaude,
  SiDatabricks,
  SiDocker,
  SiJupyter,
  SiNextdotjs,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiR,
  SiReact,
  SiScikitlearn,
  SiSnowflake,
  SiTypescript,
} from "react-icons/si";
import { ChartColumn, Database, FileSpreadsheet } from "lucide-react";

type IconProps = { size?: number };

const lucide =
  (Icon: ComponentType<{ size?: number; strokeWidth?: number }>) =>
  // eslint-disable-next-line react/display-name
  ({ size }: IconProps) => <Icon size={size} strokeWidth={1.7} />;

/** Map of icon keys (used in src/content/site.ts `tech`) to components. */
export const techIcons: Record<string, ComponentType<IconProps>> = {
  python: SiPython,
  r: SiR,
  jupyter: SiJupyter,
  pandas: SiPandas,
  sklearn: SiScikitlearn,
  snowflake: SiSnowflake,
  databricks: SiDatabricks,
  docker: SiDocker,
  postgres: SiPostgresql,
  react: SiReact,
  next: SiNextdotjs,
  typescript: SiTypescript,
  claude: SiClaude,
  database: lucide(Database),
  excel: lucide(FileSpreadsheet),
  bars: lucide(ChartColumn),
};
