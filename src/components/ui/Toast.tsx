"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HiX,
  HiExclamationCircle,
  HiCheckCircle,
  HiInformationCircle,
} from "react-icons/hi";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Wait for animation
  }, [id, onClose]);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto-close timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <HiCheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <HiExclamationCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <HiExclamationCircle className="w-5 h-5 text-yellow-400" />;
      case "info":
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "warning":
        return "border-yellow-500";
      case "info":
      default:
        return "border-blue-500";
    }
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        bg-gray-800 border-l-4 ${getBorderColor()} rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white font-inter">{title}</p>
            {message && (
              <p className="mt-1 text-sm text-gray-300 font-inter">{message}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-white transition-colors"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
