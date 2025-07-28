"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "../types/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<ToasterToast>;
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST;
      toastId?: ToasterToast["id"];
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST;
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST:
      const { toastId } = action;
      // ! This is not ideal, but we need to dismiss all toasts if no toastId is provided
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        };
      } else {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({ ...t, open: false })),
        };
      }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const ToastContext = React.createContext<
  | {
      toast: ({ ...props }: ToastProps) => {
        id: string;
        dismiss: () => void;
        update: (props: ToasterToast) => void;
      };
      dismiss: (toastId?: string) => void;
    }
  | undefined
>(undefined);

export const ToasterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }, []);

  const addToast = React.useCallback((toast: ToasterToast) => {
    dispatch({ type: actionTypes.ADD_TOAST, toast });
  }, []);

  const updateToast = React.useCallback((toast: Partial<ToasterToast>) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast });
  }, []);

  const removeToast = React.useCallback((toastId?: string) => {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, []);

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (typeof toast.duration === "number") {
        setTimeout(() => dismiss(toast.id), toast.duration);
      }
      if (toast.open === false) {
        setTimeout(() => removeToast(toast.id), TOAST_REMOVE_DELAY);
      }
    });
  }, [state.toasts, dismiss, removeToast]);

  const toast = React.useCallback(
    ({ ...props }: ToastProps) => {
      const id = genId();

      const update = (props: ToasterToast) => updateToast({ id, ...props });
      const dismiss = () => dismiss(id);

      addToast({
        id,
        open: true,
        ...props,
        onOpenChange: (open) => {
          if (!open) dismiss();
        },
      });

      return {
        id: id,
        dismiss,
        update,
      };
    },
    [addToast, dismiss, updateToast]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Render the Toaster component here */}
      <Toaster toasts={state.toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToasterProvider");
  }
  return context;
};

// Placeholder for Toaster component, actual implementation will be in components/ui/toaster.tsx
const Toaster = ({ toasts }: { toasts: ToasterToast[] }) => null;
