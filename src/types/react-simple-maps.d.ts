declare module "react-simple-maps" {
  import { ComponentType, ReactNode, CSSProperties, ForwardRefExoticComponent, RefAttributes } from "react";

  interface ProjectionConfig {
    rotate?: [number, number, number];
    center?: [number, number];
    scale?: number;
    parallels?: [number, number];
  }

  interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((width: number, height: number, config: ProjectionConfig) => unknown);
    projectionConfig?: ProjectionConfig;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface GeographyItem {
    rsmKey: string;
    svgPath: string;
    properties: Record<string, unknown>;
    id?: string | number;
    [key: string]: unknown;
  }

  interface GeographiesRenderProps {
    geographies: GeographyItem[];
    outline: unknown;
    borders: unknown;
    path: (geo: unknown) => string;
    projection: unknown;
  }

  interface GeographiesProps {
    geography: string | object | unknown[];
    children: (props: GeographiesRenderProps) => ReactNode;
    parseGeographies?: (geographies: unknown[]) => unknown[];
    className?: string;
  }

  interface GeographyStyleObject {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
    [key: string]: unknown;
  }

  interface GeographyStyle {
    default?: GeographyStyleObject;
    hover?: GeographyStyleObject;
    pressed?: GeographyStyleObject;
  }

  interface GeographyProps {
    geography: GeographyItem;
    style?: GeographyStyle;
    className?: string;
    onMouseEnter?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onMouseDown?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onMouseUp?: (evt: React.MouseEvent<SVGPathElement>) => void;
    onFocus?: (evt: React.FocusEvent<SVGPathElement>) => void;
    onBlur?: (evt: React.FocusEvent<SVGPathElement>) => void;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: unknown;
  }

  interface MarkerStyleObject {
    fill?: string;
    stroke?: string;
    cursor?: string;
    [key: string]: unknown;
  }

  interface MarkerStyle {
    default?: MarkerStyleObject;
    hover?: MarkerStyleObject;
    pressed?: MarkerStyleObject;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: MarkerStyle;
    className?: string;
    onMouseEnter?: (evt: React.MouseEvent<SVGGElement>) => void;
    onMouseLeave?: (evt: React.MouseEvent<SVGGElement>) => void;
    onMouseDown?: (evt: React.MouseEvent<SVGGElement>) => void;
    onMouseUp?: (evt: React.MouseEvent<SVGGElement>) => void;
    onFocus?: (evt: React.FocusEvent<SVGGElement>) => void;
    onBlur?: (evt: React.FocusEvent<SVGGElement>) => void;
    onClick?: (evt: React.MouseEvent<SVGGElement>) => void;
  }

  const ComposableMap: ForwardRefExoticComponent<ComposableMapProps & RefAttributes<SVGSVGElement>>;
  const Geographies: ForwardRefExoticComponent<GeographiesProps & RefAttributes<SVGGElement>>;
  const Geography: ComponentType<GeographyProps>;
  const Marker: ForwardRefExoticComponent<MarkerProps & RefAttributes<SVGGElement>>;
}
