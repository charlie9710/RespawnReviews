import type { ReactNode } from "react";
type props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};
function Button({ children, type = "button", onClick }: props) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="bg-red-950 px-6 py-2 font-bold rounded"
      >
        {children}
      </button>
    </>
  );
}

export default Button;
