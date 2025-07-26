import type { ComponentPropsWithoutRef } from "react"
import type * as ToastPrimitives from "@radix-ui/react-toast"

export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
export type ToastActionElement = ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
