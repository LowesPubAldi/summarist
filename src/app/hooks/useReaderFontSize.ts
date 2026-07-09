"use client";

import { useEffect, useState } from "react";

const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_STORAGE_KEY = "readerFontSize";

export function useReaderFontSize() {
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [hasLoadedStoredValue, setHasLoadedStoredValue] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(FONT_SIZE_STORAGE_KEY);

    if (storedValue) {
      const parsedValue = Number(storedValue);

      if (Number.isFinite(parsedValue)) {
        setFontSize(parsedValue);
      }
    }

    setHasLoadedStoredValue(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredValue) {
      return;
    }

    localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontSize));
  }, [fontSize, hasLoadedStoredValue]);

  return {
    fontSize,
    setFontSize,
  };
}
