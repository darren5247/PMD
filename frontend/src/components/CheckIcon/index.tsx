interface CheckIconProps {
  className?: string;
  fill?: string;
  size?: number;
}

export const CheckIcon = ({
  className = "",
  fill = "#00ba00",
  size = 21,
}: CheckIconProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      clipRule="evenodd"
      fillRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 21.0001 21.0001"
    >
      <g>
        <path d="m0 0h21v21h-21z" fill="none" />
        <path
          d="m10.5038 1.31775c5.07328 0 9.1876 4.11432 9.1876 9.1876s-4.11432 9.1876-9.1876 9.1876-9.1876-4.11432-9.1876-9.1876 4.11432-9.1876 9.1876-9.1876zm-1.90792 12.1718-2.24935-2.25121c-.38321-.38344-.38329-1.00872 0-1.39208.38337-.38329 1.01143-.38089 1.39201 0l1.58578 1.58702 3.94488-3.94488c.38337-.38337 1.00872-.38337 1.39201 0 .38337.38329.38282 1.00918 0 1.39201l-4.64201 4.64201c-.38282.38282-1.00872.38337-1.39201 0-.01077-.01077-.02116-.0217-.03131-.03286z"
          fill={fill}
        />
      </g>
    </svg>
  );
};
