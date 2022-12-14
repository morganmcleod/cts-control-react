export default function Disabled({ disabled, children }) {
  if (disabled) {
    return (
      <div style={{ opacity: 0.5, pointerEvents: "none" }} disabled>
        {children}
      </div>
    );
  }
  return <div>{children}</div>;
}
