interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const IconCrown = (iconProps: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconProps.size || 24}
      height={iconProps.size || 24}
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z"></path>
    </svg>
  );
};
