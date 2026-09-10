"use client";
export function ProfileActions() {
  return (
    <button
      type="button"
      className="text-link print-button"
      onClick={() => window.print()}
    >
      Print profile ↗
    </button>
  );
}
