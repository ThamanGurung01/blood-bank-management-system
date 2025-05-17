import type { HTMLAttributes } from "react";


export function Skeleton({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={"animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-700/50"}
      {...props}
    />
  );
}
